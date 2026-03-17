import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, User, Clock, Share2 } from "lucide-react";
import blogCardImage from "../assets/BlogCard.png";
import { useTranslation } from "react-i18next";

export default function BlogPost() {
  const { id } = useParams();
  const { t } = useTranslation();

  // Mock post data (in a real app, you would fetch based on the id)
  const post = {
    id: id,
    title: t('blog.post.title'),
    date: "21 Jul 2023",
    readTime: "5 min",
    author: t('blog.post.author'),
    image: blogCardImage,
    category: t('blog.post.category'),
    content: `
      <p class="mb-6">${t('blog.post.content_p1')}</p>
      
      <h2 class="text-2xl font-bold mb-4 mt-8">${t('blog.post.h2_1')}</h2>
      <p class="mb-6">${t('blog.post.content_p2')}</p>
      
      <h2 class="text-2xl font-bold mb-4 mt-8">${t('blog.post.h2_2')}</h2>
      <p class="mb-6">${t('blog.post.content_p3')}</p>
      
      <blockquote class="border-l-4 border-green-500 pl-4 py-2 italic my-8 text-xl text-gray-700 bg-gray-50">
        "${t('blog.post.quote')}"
      </blockquote>
      
      <h2 class="text-2xl font-bold mb-4 mt-8">${t('blog.post.h2_3')}</h2>
      <p class="mb-6">${t('blog.post.content_p4')}</p>
    `
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <Link to="/blog" className="inline-flex items-center text-gray-600 hover:text-green-600 font-medium mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('blog.post.back_to_blog')}
        </Link>
        
        {/* Article Header */}
        <div className="mb-10 text-center">
          <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold mb-4">
            {post.category}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-center gap-4 text-gray-500 text-sm">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              {post.author}
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {post.date}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {post.readTime}
            </div>
          </div>
        </div>
        
        {/* Featured Image */}
        <div className="mb-12 rounded-xl overflow-hidden shadow-lg border border-gray-200">
          <img src={post.image} alt={post.title} className="w-full h-auto object-cover max-h-[500px]" />
        </div>
        
        {/* Article Content */}
        <div className="bg-white rounded-xl shadow-sm p-6 sm:p-10 border border-gray-200">
          <div 
            className="prose prose-lg max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          
          {/* Share Section */}
          <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">{t('blog.post.share_article')}</h3>
            <div className="flex gap-4">
              <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
