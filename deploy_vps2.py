import paramiko
import os
import sys

# Force UTF-8 encoding for stdout
sys.stdout.reconfigure(encoding='utf-8')

host = "159.198.66.191"
user = "root"
password = "Qvlq6YQkVw7J5158rU"
domain = "freelance-224.com"
www_domain = f"www.{domain}"
email = "contact@freelance-224.com"
remote_path = "/var/www/freelance-224.com"

def main():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    print(f"Connecting to {host}...")
    ssh.connect(host, username=user, password=password)
    print("Connected successfully!")

    def run(cmd):
        print(f"> {cmd}")
        sys.stdout.flush()
        stdin, stdout, stderr = ssh.exec_command(cmd)
        exit_status = stdout.channel.recv_exit_status()
        out = stdout.read().decode('utf-8', errors='replace')
        err = stderr.read().decode('utf-8', errors='replace')
        if out:
            print(f"  [stdout] {out.strip()}")
        if err:
            print(f"  [stderr] {err.strip()}")
        sys.stdout.flush()
        return exit_status, out

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
    # Write config to temp file and upload it
    with open("nginx_temp.conf", "w", encoding='utf-8') as f:
        f.write(nginx_conf)
    
    from scp import SCPClient
    
    # 1. Compress local dist folder
    print("Compressing dist folder...")
    import subprocess
    subprocess.run(["tar", "-czf", "dist.tar.gz", "dist"], check=True)
    
    # 2. Upload dist folder and nginx config
    print("Uploading files...")
    with SCPClient(ssh.get_transport()) as scp:
        scp.put('dist.tar.gz', remote_path="/tmp/dist.tar.gz")
        scp.put('nginx_temp.conf', remote_path="/tmp/nginx_temp.conf")
        
    os.remove("nginx_temp.conf")
    os.remove("dist.tar.gz")
    
    # 3. Extract dist folder on server
    print("Extracting files on server...")
    run(f"mkdir -p {remote_path}")
    run(f"tar -xzf /tmp/dist.tar.gz -C {remote_path}")
    run("rm /tmp/dist.tar.gz")

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
