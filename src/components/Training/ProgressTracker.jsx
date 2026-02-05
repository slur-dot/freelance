import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, Award, Download, BookOpen } from 'lucide-react';

export default function ProgressTracker({ courseId, userId }) {
  const [progress, setProgress] = useState({
    courseId: courseId,
    userId: userId,
    totalLessons: 10,
    completedLessons: 3,
    currentLesson: 4,
    totalTime: 300, // minutes
    watchedTime: 90, // minutes
    certificates: [],
    resources: []
  });

  const [lessons] = useState([
    { id: 1, title: "Introduction to Web Development", duration: 15, completed: true },
    { id: 2, title: "HTML Fundamentals", duration: 25, completed: true },
    { id: 3, title: "CSS Styling", duration: 30, completed: true },
    { id: 4, title: "JavaScript Basics", duration: 35, completed: false, current: true },
    { id: 5, title: "DOM Manipulation", duration: 40, completed: false },
    { id: 6, title: "React Introduction", duration: 45, completed: false },
    { id: 7, title: "React Components", duration: 50, completed: false },
    { id: 8, title: "State Management", duration: 55, completed: false },
    { id: 9, title: "API Integration", duration: 60, completed: false },
    { id: 10, title: "Project Deployment", duration: 30, completed: false }
  ]);

  const [resources] = useState([
    { id: 1, name: "HTML Cheat Sheet", type: "PDF", size: "2.3 MB", downloaded: true },
    { id: 2, name: "CSS Reference Guide", type: "PDF", size: "1.8 MB", downloaded: false },
    { id: 3, name: "JavaScript Exercises", type: "ZIP", size: "5.2 MB", downloaded: false },
    { id: 4, name: "React Component Templates", type: "ZIP", size: "3.1 MB", downloaded: false }
  ]);

  const [certificates] = useState([
    { id: 1, name: "HTML Fundamentals Certificate", earned: true, date: "2024-01-15" },
    { id: 2, name: "CSS Styling Certificate", earned: true, date: "2024-01-20" },
    { id: 3, name: "JavaScript Basics Certificate", earned: false, progress: 60 },
    { id: 4, name: "Complete Web Development Certificate", earned: false, progress: 30 }
  ]);

  const completionPercentage = (progress.completedLessons / progress.totalLessons) * 100;
  const timeProgressPercentage = (progress.watchedTime / progress.totalTime) * 100;

  const handleLessonComplete = (lessonId) => {
    setProgress(prev => ({
      ...prev,
      completedLessons: prev.completedLessons + 1,
      currentLesson: lessonId + 1
    }));
  };

  const handleResourceDownload = (resourceId) => {
    // Simulate download
    console.log(`Downloading resource ${resourceId}`);
  };

  const handleCertificateDownload = (certificateId) => {
    // Simulate certificate download
    console.log(`Downloading certificate ${certificateId}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold">Course Progress</h2>
      </div>

      {/* Overall Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Lessons Progress</h3>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-blue-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <span className="text-sm font-medium text-blue-800">
              {progress.completedLessons}/{progress.totalLessons}
            </span>
          </div>
          <p className="text-sm text-blue-600 mt-1">{completionPercentage.toFixed(1)}% Complete</p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">Time Progress</h3>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-green-200 rounded-full h-3">
              <div
                className="bg-green-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${timeProgressPercentage}%` }}
              />
            </div>
            <span className="text-sm font-medium text-green-800">
              {progress.watchedTime}/{progress.totalTime} min
            </span>
          </div>
          <p className="text-sm text-green-600 mt-1">{timeProgressPercentage.toFixed(1)}% Watched</p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="font-semibold text-purple-800 mb-2">Certificates</h3>
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">
              {certificates.filter(c => c.earned).length}/{certificates.length}
            </span>
          </div>
          <p className="text-sm text-purple-600 mt-1">Certificates Earned</p>
        </div>
      </div>

      {/* Lessons List */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Course Lessons</h3>
        <div className="space-y-3">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className={`flex items-center gap-4 p-3 rounded-lg border-2 transition-all ${
                lesson.current
                  ? 'border-blue-500 bg-blue-50'
                  : lesson.completed
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex-shrink-0">
                {lesson.completed ? (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                ) : (
                  <Circle className="h-6 w-6 text-gray-400" />
                )}
              </div>
              
              <div className="flex-1">
                <h4 className="font-medium">{lesson.title}</h4>
                <p className="text-sm text-gray-600">{lesson.duration} minutes</p>
              </div>
              
              <div className="flex-shrink-0">
                {lesson.completed ? (
                  <span className="text-green-600 text-sm font-medium">Completed</span>
                ) : lesson.current ? (
                  <span className="text-blue-600 text-sm font-medium">Current</span>
                ) : (
                  <span className="text-gray-500 text-sm">Locked</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resources */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Downloadable Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <Download className="h-5 w-5 text-gray-500" />
              <div className="flex-1">
                <h4 className="font-medium">{resource.name}</h4>
                <p className="text-sm text-gray-600">{resource.type} • {resource.size}</p>
              </div>
              <button
                onClick={() => handleResourceDownload(resource.id)}
                className={`px-3 py-1 rounded text-sm ${
                  resource.downloaded
                    ? 'bg-green-100 text-green-700'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                {resource.downloaded ? 'Downloaded' : 'Download'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Certificates */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Certificates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certificates.map((certificate) => (
            <div
              key={certificate.id}
              className={`p-4 border-2 rounded-lg ${
                certificate.earned
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <Award className={`h-5 w-5 ${
                  certificate.earned ? 'text-green-600' : 'text-gray-400'
                }`} />
                <h4 className="font-medium">{certificate.name}</h4>
              </div>
              
              {certificate.earned ? (
                <div className="space-y-2">
                  <p className="text-sm text-green-600">Earned on {certificate.date}</p>
                  <button
                    onClick={() => handleCertificateDownload(certificate.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                  >
                    Download Certificate
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${certificate.progress}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">{certificate.progress}%</span>
                  </div>
                  <p className="text-sm text-gray-600">Complete more lessons to earn this certificate</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
