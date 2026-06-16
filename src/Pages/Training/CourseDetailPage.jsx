import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PlayCircle, ChevronRight, Download, Award, BookOpen, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";
import coursesImg from "../../assets/Courses_image.png";
import VideoPlayer from "../../components/Training/VideoPlayer";
import ProgressTracker from "../../components/Training/ProgressTracker";
import { useAuth } from "../../contexts/AuthContext";

export default function CourseDetailPage() {
  const [tab, setTab] = useState("videos");
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const hasPurchasedTraining = localStorage.getItem('hasPurchasedTraining') === 'true';
  const course = location.state?.course;
  const progressValue = 50;

  const courseTitle = course?.title || t('training.courses.freelance.course_1.title');
  const courseDescription = course?.description || t('training.courses.freelance.course_1.description');

  const rawLessons = course?.lessons || [];

  const courseLessons = rawLessons.map((lesson, index) => {
    const isIntro = index < 2;
    const isUnlocked = currentUser && (isIntro || hasPurchasedTraining);
    const completed = hasPurchasedTraining && index < 3; // mock completed for first 3 if purchased
    return { ...lesson, isUnlocked, completed };
  });

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      {/* full-width max container */}
      <div className="max-w-6xl mx-auto p-6 md:p-8 bg-white shadow-md">
        {/* internal horizontal margin for all content */}
        <div className="sm:mx-8 lg:mx-16">
          {/* Static Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-6 flex items-center flex-wrap">
            <Link to="/" className="hover:underline hover:text-blue-600">
              {t('freelancer.profile.breadcrumbs.home')}
            </Link>
            <span className="mx-2">
              <ChevronRight className="inline-block h-3 w-3" />
            </span>
            <Link
              to="/training-modules"
              className="hover:underline hover:text-blue-600"
            >
              {t('training.modules.breadcrumb')}
            </Link>
            <span className="mx-2">
              <ChevronRight className="inline-block h-3 w-3" />
            </span>
            <span className="font-medium text-blue-600">{courseTitle}</span>
          </nav>

          {/* Header */}
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {courseTitle}
            </h1>
            <p className="text-gray-600 leading-relaxed">{courseDescription}</p>
          </div>

          {/* Course Image */}
          <div className="mb-8 overflow-hidden shadow-md max-w-3xl mx-auto">
            <img
              src={coursesImg}
              alt={courseTitle}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-md font-medium text-green-800">
                {t('training.detail.progress.complete', { percent: progressValue })}
              </span>
              <span className="text-sm font-medium text-green-800">&nbsp;</span>
            </div>

            <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              {/* Progress Line */}
              <div
                className="h-full bg-green-800"
                style={{ width: `${progressValue}%` }}
              />

              {/* Green Circle at Right End */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-green-800 border-4 border-green-800 shadow-md"
                style={{ left: `calc(${progressValue}% - 1rem)` }}
              />
            </div>
          </div>

          {/* Tabs Container  */}
          <div className="bg-gray-50 p-4 border border-gray-300">
            <div className="flex overflow-x-auto whitespace-nowrap scrollbar-hide gap-2 sm:gap-4 pb-2">
              {["videos", "progress", "resources", "certificate", "notes"].map((item) => (
                <button
                  key={item}
                  onClick={() => setTab(item)}
                  className={`py-2 px-3 text-sm sm:text-base font-medium rounded-none flex items-center gap-2 flex-shrink-0 ${tab === item
                      ? "text-black border-b-2 border-black"
                      : "text-gray-600 hover:text-black border-b-2 border-transparent"
                    }`}
                >
                  {item === "videos" && <PlayCircle className="h-4 w-4" />}
                  {item === "progress" && <BookOpen className="h-4 w-4" />}
                  {item === "resources" && <Download className="h-4 w-4" />}
                  {item === "certificate" && <Award className="h-4 w-4" />}
                  {item === "notes" && <BookOpen className="h-4 w-4" />}
                  {t(`training.detail.tabs.${item}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content  */}
          <div className="bg-gray-50 p-0 rounded-sm">
            {tab === "videos" && (
              <div className="p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-4">{t('training.detail.lessons.title')}</h3>
                  {courseLessons.map((lesson, index) => (
                    <div key={index} className={`border rounded-lg p-4 transition-shadow overflow-hidden ${lesson.isUnlocked ? 'border-gray-200 hover:shadow-md bg-white' : 'border-gray-100 bg-gray-50 opacity-80'}`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            {lesson.completed ? (
                              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm">✓</span>
                              </div>
                            ) : !lesson.isUnlocked ? (
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                <Lock className="w-4 h-4 text-gray-500" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <PlayCircle className="w-4 h-4 text-blue-600" />
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 className={`font-medium leading-tight ${lesson.isUnlocked ? 'text-gray-900' : 'text-gray-500'}`}>{lesson.title}</h4>
                            <p className="text-sm text-gray-500 mt-1">{t('training.detail.lessons.duration', { duration: lesson.duration })}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto sm:pl-0">
                          {!currentUser ? (
                            <button
                              onClick={() => navigate('/login')}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                            >
                              Log in to Watch
                            </button>
                          ) : lesson.isUnlocked ? (
                            <>
                              <button
                                onClick={() => window.open(lesson.videoUrl, '_blank')}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                              >
                                {t('training.detail.lessons.watch')}
                              </button>
                              {lesson.completed && (
                                <span className="text-green-600 text-sm font-medium whitespace-nowrap">{t('training.detail.lessons.completed')}</span>
                              )}
                            </>
                          ) : (
                            <span className="text-gray-500 text-sm font-medium whitespace-nowrap flex items-center gap-1">
                              <Lock className="w-4 h-4" /> {t('training.status.locked')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "progress" && (
              <div className="p-6">
                <ProgressTracker courseId="web-dev-basics" userId="user-123" />
              </div>
            )}

            {tab === "resources" && (
              <div className="p-6 text-gray-700">
                <h3 className="text-xl font-semibold mb-3">
                  {t('training.detail.resources.title')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">{t('training.detail_content.resources.r1.name')}</h4>
                    <p className="text-sm text-gray-600 mb-3">{t('training.detail_content.resources.r1.desc')}</p>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                      {t('training.detail.resources.download')} PDF
                    </button>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">{t('training.detail_content.resources.r2.name')}</h4>
                    <p className="text-sm text-gray-600 mb-3">{t('training.detail_content.resources.r2.desc')}</p>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                      {t('training.detail.resources.download')} PDF
                    </button>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">{t('training.detail_content.resources.r3.name')}</h4>
                    <p className="text-sm text-gray-600 mb-3">{t('training.detail_content.resources.r3.desc')}</p>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                      {t('training.detail.resources.download')} ZIP
                    </button>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">{t('training.detail_content.resources.r4.name')}</h4>
                    <p className="text-sm text-gray-600 mb-3">{t('training.detail_content.resources.r4.desc')}</p>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                      {t('training.detail.resources.download')} ZIP
                    </button>
                  </div>
                </div>
              </div>
            )}

            {tab === "certificate" && (
              <div className="p-6 text-gray-700">
                <h3 className="text-xl font-semibold mb-3">{t('training.detail.certificates.title')}</h3>
                <div className="space-y-4">
                  <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Award className="h-6 w-6 text-green-600" />
                      <h4 className="font-semibold text-green-800">{t('training.detail_content.certificates.c1')}</h4>
                    </div>
                    <p className="text-sm text-green-700 mb-3">{t('training.detail.certificates.earned_on', { date: '15/01/2024' })}</p>
                    <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                      {t('training.detail.certificates.download')}
                    </button>
                  </div>
                  <div className="border border-gray-200 bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Award className="h-6 w-6 text-gray-400" />
                      <h4 className="font-semibold text-gray-600">{t('training.detail_content.certificates.c2')}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{t('training.detail.certificates.complete_more')}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                    </div>
                    <p className="text-sm text-gray-600">{t('training.detail.certificates.progress', { percent: 30 })}</p>
                  </div>
                </div>
              </div>
            )}

            {tab === "notes" && (
              <div className="p-6 text-gray-700">
                <h3 className="text-xl font-semibold mb-3">{t('training.detail.tabs.notes')}</h3>
                <p>{t('training.detail.notes', { defaultValue: "You can take notes here as you progress through the course." })}</p>
              </div>
            )}
          </div>


          <div className="bg-gray-50 p-5 border border-gray-300 mt-px" />
        </div>
      </div>
    </div>
  );
}


function Accordion({ title, items = [], dense = false }) {
  const [open, setOpen] = useState(true);
  const itemGap = dense ? "space-y-1" : "space-y-3";
  const itemPad = dense ? "py-1" : "py-2";
  const textSize = dense ? "text-sm" : "text-base";
  const iconSize = dense ? "w-4 h-4" : "w-5 h-5";

  return (
    <div className="border border-gray-300 shadow-sm mb-0 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-3 md:p-4 text-left font-semibold text-gray-800 hover:bg-gray-50 flex justify-between items-center"
      >
        {title}
        <ChevronRight
          className={`h-4 w-4 transition-transform ${open ? "rotate-90" : ""}`}
        />
      </button>
      {open && (
        <div className="p-3 md:p-4 border-t border-gray-300 bg-white">
          <ul className={`${itemGap}`}>
            {items.map((item, idx) => (
              <li
                key={idx}
                className={`flex items-center text-gray-700 ${itemPad} ${textSize}`}
              >
                <PlayCircle className={`${iconSize} ml-10 mr-3 text-gray-500`} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
