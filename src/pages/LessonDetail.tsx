import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import AudioPlayer from "@/components/AudioPlayer";
import ChatBox from "@/components/ChatBox";
import { mockTopics, currentStudent } from "@/data/mockData";
import { LessonSection, ContentItem } from "@/types";

const LessonDetail = () => {
  const navigate = useNavigate();
  const { lessonId } = useParams();

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentSection, setCurrentSection] = useState<LessonSection | null>(
    null
  );
  const [activeContent, setActiveContent] = useState<ContentItem[]>([]);
  const [topicTitle, setTopicTitle] = useState("");
  const [lessonTitle, setLessonTitle] = useState("");
  const [lesson, setLesson] = useState<any>(null);
  const [customAudioUrl, setCustomAudioUrl] = useState<string | null>(null);
  const [isSecondPartPlayed, setIsSecondPartPlayed] = useState(false);
  const [secondPartFinished, setSecondPartFinished] = useState(false);
  const [isThirdPartPlayed, setIsThirdPartPlayed] = useState(false);
  const [thirdPartFinished, setThirdPartFinished] = useState(false);
  const [videoCompleted, setVideoCompleted] = useState(false);
  const [isSixthPartPlayed, setIsSixthPartPlayed] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);
  const [audioSevenPlayed, setAudioSevenPlayed] = useState(false);
  const [quizDisplayed, setQuizDisplayed] = useState(false);
  const [isQuizAnswered, setIsQuizAnswered] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState(0);

  useEffect(() => {
    let foundLesson = null;
    let foundTopicTitle = "";
    let foundLessonTitle = "";

    for (const topic of mockTopics) {
      const found = topic.lessons.find((l) => l.id === lessonId);
      if (found) {
        foundLesson = found;
        foundTopicTitle = topic.title;
        foundLessonTitle = found.title;
        break;
      }
    }

    setLesson(foundLesson);
    setTopicTitle(foundTopicTitle);
    setLessonTitle(foundLessonTitle);

    setIsSecondPartPlayed(false);
    setSecondPartFinished(false);
    setIsThirdPartPlayed(false);
    setThirdPartFinished(false);
    setVideoCompleted(false);
    setVideoStarted(false);
    setAudioSevenPlayed(false);
    setQuizDisplayed(false);
    setIsQuizAnswered(false);
    setIsAnswerCorrect(false);
    setLessonCompleted(false);
    setProgressPercentage(25);
  }, [lessonId]);

  useEffect(() => {
    if (lesson && lesson.sections.length > 0) {
      setCurrentSection(lesson.sections[currentSectionIndex]);

      if (lessonId === "4001" && currentSectionIndex === 0) {
        const initialImage: ContentItem = {
          id: "helping-gif",
          type: "image",
          data: {
            type: "image",
            url: "https://hlearn.b-cdn.net/what%20is%20work/helping.gif",
            alt: "People Helping Each Other",
          },
          timing: 0,
        };
        setActiveContent([initialImage]);
        setCustomAudioUrl(
          "https://hlearn.b-cdn.net/what%20is%20work/whatisworkaudio1.mp3"
        );
        setIsSecondPartPlayed(false);
        setSecondPartFinished(false);
        setIsThirdPartPlayed(false);
        setThirdPartFinished(false);
        setVideoCompleted(false);
        setVideoStarted(true);
        setAudioSevenPlayed(false);
        setQuizDisplayed(false);
      } else if (lessonId === "4002" && currentSectionIndex === 0) {
        const initialImage: ContentItem = {
          id: "money-intro-image",
          type: "image",
          data: {
            type: "image",
            url: "https://hlearn.b-cdn.net/what%20is%20money/money.gif",
            alt: "What Is Money?",
          },
          timing: 0,
        };
        setActiveContent([initialImage]);
        setCustomAudioUrl(
          "https://hlearn.b-cdn.net/what%20is%20money/whatismoney1.mp3"
        );
        setIsSecondPartPlayed(false);
        setSecondPartFinished(false);
        setIsThirdPartPlayed(false);
        setThirdPartFinished(false);
        setVideoCompleted(false);
        setVideoStarted(false);
        setAudioSevenPlayed(false);
        setQuizDisplayed(false);
      } else if (lessonId === "4003" && currentSectionIndex === 0) {
        const initialImage: ContentItem = {
          id: "wants-needs-intro",
          type: "image",
          data: {
            type: "image",
            url: "https://hlearn.b-cdn.net/wantsvsneeds/toystore.gif",
            alt: "Toy store with many toys",
          },
          timing: 0,
        };
        setActiveContent([initialImage]);
        setCustomAudioUrl(
          "https://hlearn.b-cdn.net/wantsvsneeds/wantsvsneeds1.mp3"
        );
        setIsSecondPartPlayed(false);
        setSecondPartFinished(false);
        setIsThirdPartPlayed(false);
        setThirdPartFinished(false);
        setVideoCompleted(false);
        setVideoStarted(false);
        setAudioSevenPlayed(false);
        setQuizDisplayed(false);
      } else if (lessonId === "4004" && currentSectionIndex === 0) {
        const initialImage: ContentItem = {
          id: "make-money-dog-image",
          type: "image",
          data: {
            type: "image",
            url: "https://hlearn.b-cdn.net/How%20do%20I%20make%20money/dog.gif",
            alt: "Dog walking - a way to make money",
          },
          timing: 0,
        };
        setActiveContent([initialImage]);
        setCustomAudioUrl(
          "https://hlearn.b-cdn.net/How%20do%20I%20make%20money/howdoimakemoney.mp3"
        );
        setIsSecondPartPlayed(false);
        setSecondPartFinished(false);
        setIsThirdPartPlayed(false);
        setThirdPartFinished(false);
        setVideoCompleted(false);
        setVideoStarted(false);
        setAudioSevenPlayed(false);
        setQuizDisplayed(false);
      } else {
        setActiveContent([]);
      }
    }
  }, [lesson, currentSectionIndex, lessonId]);

  useEffect(() => {
    if (isSecondPartPlayed && !secondPartFinished) {
      setProgressPercentage(40);
    } else if (secondPartFinished && isThirdPartPlayed && !thirdPartFinished) {
      setProgressPercentage(60);
    } else if (thirdPartFinished && videoCompleted && !isSixthPartPlayed) {
      setProgressPercentage(70);
    } else if (isSixthPartPlayed && !quizDisplayed) {
      setProgressPercentage(75);
    } else if (lessonCompleted) {
      setProgressPercentage(100);
    }
  }, [
    isSecondPartPlayed,
    secondPartFinished,
    isThirdPartPlayed,
    thirdPartFinished,
    videoCompleted,
    isSixthPartPlayed,
    quizDisplayed,
    lessonCompleted,
  ]);

  const todayGoal =
    currentStudent.dailyGoals[currentStudent.dailyGoals.length - 1];
  const dailyGoalPercentage = lessonCompleted
    ? 100
    : todayGoal
    ? Math.min(
        Math.round(
          (todayGoal.completedMinutes / todayGoal.targetMinutes) * 100
        ),
        100
      )
    : progressPercentage;

  const handleTimeUpdate = (currentTime: number) => {
    if (currentSection) {
      const contentToShow = currentSection.content?.filter(
        (item) =>
          item.timing <= currentTime &&
          !activeContent.some((ac) => ac.id === item.id)
      );

      if (contentToShow && contentToShow.length > 0) {
        setActiveContent((prev) => [...prev, ...contentToShow]);
      }
    }
  };

  const handleVideoComplete = () => {
    setVideoCompleted(true);
    console.log("Video has been completely watched!");

    if (lessonId === "4001") {
      setCustomAudioUrl(
        "https://hlearn.b-cdn.net/what%20is%20work/whatisworkaudio5.mp3"
      );

      setTimeout(() => {
        setQuizDisplayed(true);
        setActiveContent((prev) => [
          ...prev,
          {
            id: "work-quiz",
            type: "quiz",
            data: {
              question: "What is work?",
              options: [
                { text: "Work is helping people in some way", color: "blue" },
                { text: "Work is typing on a computer", color: "pink" },
              ],
              correctOptionIndex: 0,
            },
            timing: 0,
          },
        ]);
      }, 1000);
    } else if (lessonId === "4002") {
      setCustomAudioUrl(
        "https://hlearn.b-cdn.net/what%20is%20money/whatismoney7.mp3"
      );

      setTimeout(() => {
        setQuizDisplayed(true);
        setActiveContent((prev) => [
          ...prev,
          {
            id: "money-quiz",
            type: "quiz",
            data: {
              question: "What is money?",
              options: [
                { text: "Money is just paper that adults use", color: "blue" },
                { text: "Money is a tool to help trade", color: "purple" },
              ],
              correctOptionIndex: 1,
            },
            timing: 0,
          },
        ]);
      }, 1000);
    } else if (lessonId === "4003") {
      setTimeout(() => {
        setQuizDisplayed(true);
        setActiveContent((prev) => [
          ...prev,
          {
            id: "wants-needs-quiz",
            type: "quiz",
            data: {
              question: "What's the difference between wants and needs?",
              options: [
                {
                  text: "Wants are things we must have, needs are extra",
                  color: "blue",
                },
                {
                  text: "Needs are things we must have, wants are extra",
                  color: "purple",
                },
              ],
              correctOptionIndex: 1,
            },
            timing: 0,
          },
        ]);
      }, 1000);
    }
  };

  const handleQuizAnswered = (isCorrect: boolean) => {
    setIsQuizAnswered(true);
    setIsAnswerCorrect(isCorrect);

    if (isCorrect) {
      if (lessonId === "4001") {
        setCustomAudioUrl(
          "https://hlearn.b-cdn.net/what%20is%20work/welldone.mp3"
        );
      } else if (lessonId === "4002") {
        setCustomAudioUrl(
          "https://hlearn.b-cdn.net/what%20is%20money/whatismoney8.mp3"
        );
      } else if (lessonId === "4003") {
        setCustomAudioUrl(
          "https://hlearn.b-cdn.net/what%20is%20work/welldone.mp3"
        );
      }

      setTimeout(() => {
        if (lessonId === "4001") {
          setCustomAudioUrl(
            "https://hlearn.b-cdn.net/what%20is%20work/congrats.mp3"
          );
        } else if (lessonId === "4002") {
          setCustomAudioUrl(
            "https://hlearn.b-cdn.net/what%20is%20work/congrats.mp3"
          );
        } else if (lessonId === "4003") {
          setCustomAudioUrl(
            "https://hlearn.b-cdn.net/what%20is%20work/congrats.mp3"
          );
        }
        setLessonCompleted(true);
      }, 3000);
    } else {
      if (lessonId === "4001") {
        setCustomAudioUrl(
          "https://hlearn.b-cdn.net/what%20is%20work/tryagain.mp3"
        );
      } else if (lessonId === "4002") {
        setCustomAudioUrl(
          "https://hlearn.b-cdn.net/what%20is%20work/tryagain.mp3"
        );
      } else if (lessonId === "4003") {
        setCustomAudioUrl(
          "https://hlearn.b-cdn.net/what%20is%20work/tryagain.mp3"
        );
      }

      setTimeout(() => {
        setIsQuizAnswered(false);

        setActiveContent((prev) =>
          prev.map((item) =>
            item.id === "work-quiz" ||
            item.id === "money-quiz" ||
            item.id === "wants-needs-quiz"
              ? {
                  ...item,
                  data: {
                    ...item.data,
                    userAnswer: undefined,
                  },
                }
              : item
          )
        );
      }, 3000);
    }
  };

  const handleSectionEnd = () => {
    if (lessonId === "4001") {
      if (!isSecondPartPlayed) {
        setCustomAudioUrl(
          "https://hlearn.b-cdn.net/what%20is%20work/whatsworkpart2.mp3"
        );
        setIsSecondPartPlayed(true);

        setActiveContent([
          {
            id: "helping-gif",
            type: "image",
            data: {
              type: "image",
              url: "https://hlearn.b-cdn.net/what%20is%20work/helping.gif",
              alt: "People Helping Each Other",
            },
            timing: 0,
          },
        ]);
      } else if (isSecondPartPlayed && !secondPartFinished) {
        setCustomAudioUrl(
          "https://hlearn.b-cdn.net/what%20is%20work/letswatch.mp3"
        );
        setSecondPartFinished(true);
        setIsThirdPartPlayed(true);

        setActiveContent([
          {
            id: "work-video",
            type: "video",
            data: {
              type: "video",
              url: "https://hlearn.b-cdn.net/what%20is%20work/whatiswork56.mp4",
              alt: "What Is Work Video",
            },
            timing: 0,
            onComplete: handleVideoComplete,
          },
        ]);
      } else if (
        secondPartFinished &&
        isThirdPartPlayed &&
        videoCompleted &&
        !quizDisplayed
      ) {
        setQuizDisplayed(true);

        setActiveContent([
          {
            id: "work-quiz",
            type: "quiz",
            data: {
              question: "What is work?",
              options: [
                { text: "Work is helping people in some way", color: "blue" },
                { text: "Work is typing on a computer", color: "pink" },
              ],
              correctOptionIndex: 0,
            },
            timing: 0,
          },
        ]);
      } else if (lessonCompleted) {
        const topicId = mockTopics.find((topic) =>
          topic.lessons.some((l) => l.id === lessonId)
        )?.id;

        if (topicId) {
          navigate(`/topic/${topicId}`);
        } else {
          navigate("/curriculum");
        }
      }
    } else if (lessonId === "4002") {
      if (!isSecondPartPlayed) {
        setCustomAudioUrl(
          "https://hlearn.b-cdn.net/what%20is%20money/whatismoney2.mp3"
        );
        setIsSecondPartPlayed(true);

        setActiveContent([
          {
            id: "coins-image",
            type: "image",
            data: {
              type: "image",
              url: "https://hlearn.b-cdn.net/what%20is%20money/catmoney.gif",
              alt: "Cat and Money",
            },
            timing: 0,
          },
        ]);
      } else if (isSecondPartPlayed && !secondPartFinished) {
        setCustomAudioUrl(
          "https://hlearn.b-cdn.net/what%20is%20money/whatismoney3.mp3"
        );
        setSecondPartFinished(true);
        setIsThirdPartPlayed(true);

        setActiveContent([
          {
            id: "banana-image",
            type: "image",
            data: {
              type: "image",
              url: "https://hlearn.b-cdn.net/what%20is%20money/banana.gif",
              alt: "Banana and Money",
            },
            timing: 0,
          },
        ]);
      } else if (isThirdPartPlayed && !thirdPartFinished) {
        setCustomAudioUrl(
          "https://hlearn.b-cdn.net/what%20is%20money/whatismoney4.mp3"
        );
        setThirdPartFinished(true);

        setActiveContent([
          {
            id: "cookie-image",
            type: "image",
            data: {
              type: "image",
              url: "https://hlearn.b-cdn.net/what%20is%20money/cookie.gif",
              alt: "Cookie and Money",
            },
            timing: 0,
          },
        ]);
      } else if (thirdPartFinished && !videoCompleted) {
        setCustomAudioUrl(
          "https://hlearn.b-cdn.net/what%20is%20money/whatismoney5.mp3"
        );
        setVideoCompleted(true);

        setActiveContent([
          {
            id: "credit-card-image",
            type: "image",
            data: {
              type: "image",
              url: "https://hlearn.b-cdn.net/what%20is%20money/creditcard.gif",
              alt: "Credit Card and Money",
            },
            timing: 0,
          },
        ]);
      } else if (videoCompleted && !isSixthPartPlayed) {
        setCustomAudioUrl(
          "https://hlearn.b-cdn.net/what%20is%20money/whatismoney6.mp3"
        );
        setIsSixthPartPlayed(true);

        setActiveContent([
          {
            id: "money-video",
            type: "video",
            data: {
              type: "video",
              url: "https://hlearn.b-cdn.net/what%20is%20money/whatismoney56.mp4",
              alt: "What Is Money Video",
            },
            timing: 0,
            onComplete: handleVideoComplete,
          },
        ]);
      } else if (lessonCompleted) {
        const topicId = mockTopics.find((topic) =>
          topic.lessons.some((l) => l.id === lessonId)
        )?.id;

        if (topicId) {
          navigate(`/topic/${topicId}`);
        } else {
          navigate("/curriculum");
        }
      }
    } else if (lessonId === "4003") {
      if (!isSecondPartPlayed) {
        setCustomAudioUrl(
          "https://hlearn.b-cdn.net/wantsvsneeds/wantsvsneeds2.mp3"
        );
        setIsSecondPartPlayed(true);

        setActiveContent([
          {
            id: "wants-needs-buy-image",
            type: "image",
            data: {
              type: "image",
              url: "https://hlearn.b-cdn.net/wantsvsneeds/buy.gif",
              alt: "Buying things",
            },
            timing: 0,
          },
        ]);
      } else if (isSecondPartPlayed && !secondPartFinished) {
        setCustomAudioUrl(
          "https://hlearn.b-cdn.net/wantsvsneeds/wantsvsneeds3.mp3"
        );
        setSecondPartFinished(true);

        setActiveContent([
          {
            id: "wants-needs-eating-image",
            type: "image",
            data: {
              type: "image",
              url: "https://hlearn.b-cdn.net/wantsvsneeds/eating.gif",
              alt: "Eating - a need",
            },
            timing: 0,
          },
        ]);
      } else if (secondPartFinished && !isThirdPartPlayed) {
        setCustomAudioUrl(
          "https://hlearn.b-cdn.net/wantsvsneeds/wantsvsneeds4.mp3"
        );
        setIsThirdPartPlayed(true);

        setActiveContent([
          {
            id: "wants-need-wantit-image",
            type: "image",
            data: {
              type: "image",
              url: "https://hlearn.b-cdn.net/wantsvsneeds/wantit.gif",
              alt: "Wanting something",
            },
            timing: 0,
          },
        ]);
      } else if (isThirdPartPlayed && !thirdPartFinished) {
        setCustomAudioUrl(
          "https://hlearn.b-cdn.net/wantsvsneeds/wantsvsneeds5.mp3"
        );
        setThirdPartFinished(true);

        setActiveContent([
          {
            id: "wants-needs-candy-image",
            type: "image",
            data: {
              type: "image",
              url: "https://hlearn.b-cdn.net/wantsvsneeds/candy.gif",
              alt: "Candy - a want",
            },
            timing: 0,
          },
        ]);
      } else if (thirdPartFinished && !videoCompleted) {
        setCustomAudioUrl(
          "https://hlearn.b-cdn.net/wantsvsneeds/wantsvsneeds6.mp3"
        );
        setVideoCompleted(true);

        setActiveContent([
          {
            id: "needs-empty-pockets",
            type: "image",
            data: {
              type: "image",
              url: "https://hlearn.b-cdn.net/wantsvsneeds/emptypockets.gif",
              alt: "Empty pockets - making choices about money",
            },
            timing: 0,
          },
        ]);
      } else if (videoCompleted && !isSixthPartPlayed) {
        if (!videoStarted) {
          setCustomAudioUrl(
            "https://hlearn.b-cdn.net/wantsvsneeds/wantsvsneeds7.mp3"
          );
          setVideoStarted(true);
          setIsSixthPartPlayed(true);

          setActiveContent([
            {
              id: "wants-needs-video",
              type: "video",
              data: {
                type: "video",
                url: "https://hlearn.b-cdn.net/wantsvsneeds/wantsvsneds56.mp4",
                alt: "Wants vs Needs Video",
              },
              timing: 0,
              onComplete: handleVideoComplete,
            },
          ]);
        }
      } else if (isSixthPartPlayed && !quizDisplayed && videoCompleted) {
        setQuizDisplayed(true);

        setActiveContent([
          {
            id: "wants-needs-quiz",
            type: "quiz",
            data: {
              question: "What's the difference between wants and needs?",
              options: [
                {
                  text: "Wants are things we must have, needs are extra",
                  color: "blue",
                },
                {
                  text: "Needs are things we must have, wants are extra",
                  color: "purple",
                },
              ],
              correctOptionIndex: 1,
            },
            timing: 0,
          },
        ]);
      } else if (lessonCompleted) {
        const topicId = mockTopics.find((topic) =>
          topic.lessons.some((l) => l.id === lessonId)
        )?.id;

        if (topicId) {
          navigate(`/topic/${topicId}`);
        } else {
          navigate("/curriculum");
        }
      }
    } else if (lessonId === "4004") {
      if (!isSecondPartPlayed) {
        setLessonCompleted(true);
      } else if (lessonCompleted) {
        const topicId = mockTopics.find((topic) =>
          topic.lessons.some((l) => l.id === lessonId)
        )?.id;

        if (topicId) {
          navigate(`/topic/${topicId}`);
        } else {
          navigate("/curriculum");
        }
      }
    } else if (lesson && currentSectionIndex < lesson.sections.length - 1) {
      setCurrentSectionIndex((prevIndex) => prevIndex + 1);
    } else {
      console.log("Lesson completed");
      const topicId = mockTopics.find((topic) =>
        topic.lessons.some((l) => l.id === lessonId)
      )?.id;

      if (topicId) {
        navigate(`/topic/${topicId}`);
      } else {
        navigate("/curriculum");
      }
    }
  };

  const getAudioUrl = () => {
    if (customAudioUrl) {
      return customAudioUrl;
    }

    return currentSection?.audioUrl || "";
  };

  if (!lesson) {
    return (
      <div className="min-h-screen bg-tutor-dark text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Lesson Not Found</h1>
          <Button onClick={() => navigate("/curriculum")}>
            Back to Curriculum
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tutor-dark text-white pt-4">
      <div className="container max-w-6xl mx-auto px-4">
        <Header student={currentStudent} />
        <div className="mb-6">
          <h1 className="text-2xl font-semibold gradient-text">
            {lessonTitle}
          </h1>
          <p className="text-sm text-gray-400">From: {topicTitle}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-6 flex flex-col items-center justify-center">
            <AudioPlayer
              audioUrl={getAudioUrl()}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleSectionEnd}
              autoPlay={true}
              key={`${getAudioUrl()}-${isSecondPartPlayed}-${secondPartFinished}-${isThirdPartPlayed}-${thirdPartFinished}-${isSixthPartPlayed}-${videoStarted}-${audioSevenPlayed}-${isQuizAnswered}-${isAnswerCorrect}-${lessonCompleted}`}
            />
          </div>
          <div className="h-[500px]">
            <ChatBox
              contentItems={activeContent}
              initialMessage={`Listening to ${currentSection?.title}... Content will appear here as the lesson progresses.`}
              hideInputField={false}
              onVideoComplete={handleVideoComplete}
              onQuizAnswered={handleQuizAnswered}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonDetail;
