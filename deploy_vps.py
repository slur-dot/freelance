import paramiko
from scp import SCPClient
import os
import sys

host = "159.198.66.191"
user = "root"
password = "Qvlq6YQkVw7J5158rU"
domain = "freelance-224.com"
www_domain = f"www.{domain}"
email = "contact@freelance-224.com"

def main():
    if not os.path.exists("dist") or not os.path.exists("server.js") or not os.path.exists("package.json"):
        print("Missing required files (dist, server.js, package.json). Please build first.")
        sys.exit(1)

    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    print(f"Connecting to {host}...")
    try:
        ssh.connect(host, username=user, password=password)
        print("Connected successfully!")
    except Exception as e:
        print(f"Connection failed: {e}")
        sys.exit(1)

    def run(cmd):
        print(f"> {cmd}")
        sys.stdout.flush()
        stdin, stdout, stderr = ssh.exec_command(cmd)
        exit_status = stdout.channel.recv_exit_status()
        out = stdout.read().decode('utf-8')
        err = stderr.read().decode('utf-8')
        if out:
            print(f"  [stdout] {out.strip()}")
        if err:
            print(f"  [stderr] {err.strip()}")
        sys.stdout.flush()
        return exit_status, out

    def run_apt(cmd):
        return run(f"export DEBIAN_FRONTEND=noninteractive && {cmd}")

    # System updates and installations
    run_apt("apt-get update -y")
    run_apt("apt-get install -y -o Dpkg::Options::=\"--force-confdef\" -o Dpkg::Options::=\"--force-confold\" nginx certbot python3-certbot-nginx curl")
    
    # Check node
    status, out = run("node -v")
    if status != 0:
        run("curl -fsSL https://deb.nodesource.com/setup_20.x | bash -")
        run_apt("apt-get install -y nodejs")
    
    run("npm install -g pm2")

    remote_path = "/var/www/freelance-224.com"
    run(f"mkdir -p {remote_path}")

    print("Uploading files via SCP...")
    sys.stdout.flush()
    def progress(filename, size, sent):
        sys.stdout.write(f"\\rUploading {filename}: {float(sent)/float(size)*100:.2f}%")
        sys.stdout.flush()

    with SCPClient(ssh.get_transport(), progress=progress) as scp:
        scp.put('dist', remote_path=remote_path, recursive=True)
        print("\\nUploaded dist")
        scp.put('server.js', remote_path=remote_path)
        scp.put('package.json', remote_path=remote_path)
    print("\\nUpload complete!")

    run(f"cd {remote_path} && npm install --omit=dev")
    run(f"cd {remote_path} && pm2 start server.js --name backend --update-env || pm2 restart backend")
    run("pm2 save")

    nginx_conf = f"""
server {{
    listen 80;
    server_name {domain} {www_domain};

    root {remote_path}/dist;
    index index.html;

    location / {{
        try_files $uri $uri/ /index.html;
    }}

    location /api/ {{
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }}
}}
"""
    # Write config to temp file and upload it because echo with quotes is tricky via SSH
    with open("nginx_temp.conf", "w") as f:
        f.write(nginx_conf)
    
    with SCPClient(ssh.get_transport()) as scp:
        scp.put('nginx_temp.conf', remote_path="/tmp/nginx_temp.conf")
    os.remove("nginx_temp.conf")

    run(f"mv /tmp/nginx_temp.conf /etc/nginx/sites-available/{domain}")
    run(f"ln -sf /etc/nginx/sites-available/{domain} /etc/nginx/sites-enabled/")
    run("rm -f /etc/nginx/sites-enabled/default")
    run("systemctl restart nginx")

    run("ufw allow 'Nginx Full'")
    run("ufw allow OpenSSH")
    run("echo 'y' | ufw enable")

    print("Running certbot...")
    status, _ = run(f"certbot --nginx --non-interactive --agree-tos -m {email} -d {domain} -d {www_domain}")
    if status == 0:
        print("SSL Certificate installed successfully!")
    else:
        print("SSL installation failed (possibly DNS not pointed). The site is available via HTTP.")

    ssh.close()
    print("Deployment complete.")

if __name__ == "__main__":
    main()
