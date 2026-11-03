import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Award, Users, UserCheck, FileText, Download, CheckCircle, 
  XCircle, Clock, Plus, Edit, Trash2, Search, Filter, LogOut, ChevronRight, 
  Settings, Database, Play, AlertCircle, Eye, FileSpreadsheet, Lock, Sparkles, RefreshCw
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, signOut
} from 'firebase/auth';
import { 
  getFirestore, doc, setDoc, getDoc, collection, onSnapshot, addDoc, updateDoc, deleteDoc
} from 'firebase/firestore';

// ---------------------------------------------------------------------------
// FIREBASE CONFIG & INITIALIZATION
// ---------------------------------------------------------------------------
const firebaseConfig = typeof __firebase_config !== 'undefined' 
  ? JSON.parse(__firebase_config)
  : {
      apiKey: "demo-api-key",
      authDomain: "aibilim-demo.firebaseapp.com",
      projectId: "aibilim-demo",
      storageBucket: "aibilim-demo.appspot.com",
      messagingSenderId: "123456789",
      appId: "1:123456789:web:demo"
    };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'aibilim-kz-app';

// Authorized Teachers List
const AUTHORIZED_TEACHERS = [
  "Наурызбайқызы Жансая"
];

// Initial default lessons for 6th Grade
const INITIAL_LESSONS_6_GRADE = [
  {
    id: 'l6_1',
    grade: 6,
    quarter: 1,
    order: 1,
    title: '1-сабақ Қауіпсіздік және Интернет желісінде жұмыс кезіндегі жауапкершілік 1',
    target: '6.4.1.1 желідегі техника қауіпсіздігі ережесін бұзудың салдарларын (алаяқтық, интернеттегі агрессия, ойынға тәуелділік) талқылау',
    summary: 'Интернет желісінде техника қауіпсіздігі ережелері мен киберқауіпсіздік негіздері.',
    pdfUrl: '',
    pptUrl: '',
    hasQuiz: false
  },
  {
    id: 'l6_2',
    grade: 6,
    quarter: 1,
    order: 2,
    title: '2-сабақ Қауіпсіздік және Интернет желісінде жұмыс кезіндегі жауапкершілік 2',
    target: '6.4.1.1 желідегі техника қауіпсіздігі ережесін бұзудың салдарларын (алаяқтық, интернеттегі агрессия, ойынға тәуелділік) талқылау',
    summary: 'Интернеттегі алаяқтық, фишинг және ойынға тәуелділікпен күресу жолдары.',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pptUrl: '',
    hasQuiz: true,
    quiz: {
      title: 'Интернет қауіпсіздігі бойынша тест',
      questions: [
        {
          id: 1,
          question: '1. Интернетте жеке мәліметтерді қалай қорғау керек?',
          options: ['A) Құпиясөзді барлық достарға айту', 'B) Жеке мәліметтерді кез келген сайтқа енгізу', 'C) Күрделі құпиясөз қолданып, оны ешкімге бермеу', 'D) Құпиясөзді әлеуметтік желіге жариялау'],
          correctIndex: 2
        },
        {
          id: 2,
          question: '2. Фишинг дегеніміз не?',
          options: ['A) Интернет жылдамдығын арттыру тәсілі', 'B) Жеке мәліметтерді алдау арқылы ұрлауға бағытталған әрекет', 'C) Компьютерді тазалау әдісі', 'D) Файлдарды реттеу тәсілі'],
          correctIndex: 1
        },
        {
          id: 3,
          question: '3. Интернеттегі кибербуллинг дегеніміз не?',
          options: ['A) Интернетте сабақ оқу', 'B) Электрондық пошта жіберу', 'C) Ақпарат іздеу', 'D) Интернет арқылы адамды қорлау, қорқыту немесе кемсіту'],
          correctIndex: 3
        },
        {
          id: 4,
          question: '4. Бейтаныс адам күмәнді сілтеме жіберсе, не істеу керек?',
          options: ['A) Сілтемені бірден ашу', 'B) Сілтемені барлық достарыңа жіберу', 'C) Сілтемені ашпай, сенімді ересек адамға немесе мұғалімге хабарлау', 'D) Жеке мәліметтеріңді енгізу'],
          correctIndex: 2
        },
        {
          id: 5,
          question: '5. Интернеттегі ойынға тәуелділіктің қандай салдары болуы мүмкін?',
          options: ['A) Ұйқының бұзылуы, денсаулыққа зиян және сабақ үлгерімінің төмендеуі', 'B) Барлық пәннен бағаның автоматты түрде көтерілуі', 'C) Компьютердің жылдамдығының міндетті түрде артуы', 'D) Интернет қауіпсіздігінің толық қамтамасыз етілуі'],
          correctIndex: 0
        }
      ]
    }
  },
  {
    id: 'l6_3',
    grade: 6,
    quarter: 1,
    order: 3,
    title: '3-сабақ Жасанды интеллектідегі деректердің рөлі 1',
    target: '6.3.3.1 «деректер», «ақпарат», «білім» ұғымдарының мәнін ажырата білу және жасанды интеллект моделдерін оқытудағы деректердің рөлі туралы түсіндіру',
    summary: 'ЖИ моделін оқыту және оған сапалы деректерді дайындау.',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pptUrl: '',
    hasQuiz: false
  },
  {
    id: 'l6_4',
    grade: 6,
    quarter: 1,
    order: 4,
    title: '4-сабақ Жасанды интеллектідегі деректердің рөлі 2',
    target: '6.3.3.1 «деректер», «ақпарат», «білім» ұғымдарының мәнін ажырата білу және жасанды интеллект моделдерін оқытудағы деректердің рөлі туралы түсіндіру',
    summary: 'Датасеттер және жасанды интеллект модельдерінің дәлдігі.',
    pdfUrl: '',
    pptUrl: '',
    hasQuiz: true,
    quiz: {
      title: 'ЖИ-дегі деректердің рөлі бойынша тест',
      questions: [
        {
          id: 1,
          question: '1. Жасанды интеллектіні үйрету үшін не қажет?',
          options: ['A) Тек компьютердің пернетақтасы', 'B) Деректер мен оқыту алгоритмдері', 'C) Тек интернет желісі', 'D) Тек мәтіндік редактор'],
          correctIndex: 1
        },
        {
          id: 2,
          question: '2. Жасанды интеллектідегі деректердің негізгі рөлі қандай?',
          options: ['A) Компьютердің түсін өзгерту', 'B) Электр қуатын үнемдеу', 'C) ЖИ-дің заңдылықтарды үйренуіне және болжам жасауына көмектесу', 'D) Монитордың жарықтығын арттыру'],
          correctIndex: 2
        },
        {
          id: 3,
          question: '3. Егер жасанды интеллектіні қате немесе сапасыз деректермен үйретсе, не болуы мүмкін?',
          options: ['A) Қате нәтижелер мен дәл емес болжамдар пайда болуы мүмкін', 'B) Барлық жауап міндетті түрде дұрыс болады', 'C) Компьютердің жады автоматты түрде көбейеді', 'D) Интернет жылдамдығы артады'],
          correctIndex: 0
        },
        {
          id: 4,
          question: '4. Жасанды интеллектіні оқытуда қолданылатын деректер жиынтығы қалай аталады?',
          options: ['A) Операциялық жүйе', 'B) Компьютерлік желі', 'C) Графикалық интерфейс', 'D) Оқыту деректерінің жиынтығы (датасет)'],
          correctIndex: 3
        },
        {
          id: 5,
          question: '5. Жасанды интеллектіні қолданғанда деректердің құпиялылығын не үшін сақтау керек?',
          options: ['A) Компьютерді жылдам өшіру үшін', 'B) Адамдардың жеке мәліметтерін қорғау үшін', 'C) Файлдардың көлемін үлкейту үшін', 'D) Бағдарламаның түсін өзгерту үшін'],
          correctIndex: 1
        }
      ]
    }
  },
  {
    id: 'l6_5',
    grade: 6,
    quarter: 1,
    order: 5,
    title: '5-сабақ Жүйелік блок құрылғысы және компьютердің жадысы 1',
    target: '6.1.1.1 жүйелік блоктің негізгі құрылғылары мен компьютердің жады (RAM, ROM, сыртқы сақтау құрылғысы, кэш-жады) түрлерінің қызметтерін сипаттау',
    summary: 'Жүйелік блок компоненттері және жедел мен тұрақты жады.',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pptUrl: '',
    hasQuiz: true,
    quiz: {
      title: 'Жүйелік блок және жады бойынша тест',
      questions: [
        {
          id: 1,
          question: '1. Жүйелік блоктың негізгі қызметі қандай?',
          options: ['A) Қағазға мәтін шығару', 'B) Компьютердің негізгі құрылғыларын орналастыру және олардың жұмысын қамтамасыз ету', 'C) Дыбысты ғана шығару', 'D) Суретті қағазға басып шығару'],
          correctIndex: 1
        },
        {
          id: 2,
          question: '2. Процессордың негізгі қызметі қандай?',
          options: ['A) Ақпаратты өңдеу және командаларды орындау', 'B) Ақпаратты қағазға басып шығару', 'C) Компьютерді электр желісіне қосу', 'D) Дыбысты күшейту'],
          correctIndex: 0
        },
        {
          id: 3,
          question: '3. Жедел жады (RAM) қандай қызмет атқарады?',
          options: ['A) Ақпаратты ұзақ уақыт сақтау', 'B) Ақпаратты тек қағазға шығару', 'C) Компьютер жұмыс істеп тұрған кезде деректер мен бағдарламаларды уақытша сақтау', 'D) Интернетке қосылуды қамтамасыз ету'],
          correctIndex: 2
        },
        {
          id: 4,
          question: '4. Ақпаратты компьютер өшірілгеннен кейін де сақтайтын құрылғыны көрсетіңіз.',
          options: ['A) RAM', 'B) Процессор', 'C) Кэш-жады', 'D) SSD немесе HDD'],
          correctIndex: 3
        },
        {
          id: 5,
          question: '5. Компьютердің аналық тақшасының қызметі қандай?',
          options: ['A) Құрылғыларды өзара байланыстыру', 'B) Мәтінді басып шығару', 'C) Дыбысты жазу ғана', 'D) Экранның жарықтығын арттыру'],
          correctIndex: 0
        }
      ]
    }
  },
  {
    id: 'l6_8',
    grade: 6,
    quarter: 1,
    order: 8,
    title: '8-сабақ Файлдық жүйе және программалық жасақтама',
    target: '6.1.1.2 операциялық жүйенің негізгі функцияларын атау және файлдық жүйеде файл атауларына байланысты ережелер мен кеңейтілімдерді қолданып, деректерді сақтауды ұйымдастыру',
    summary: 'Операциялық жүйелер мен файлдық құрылымдар.',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pptUrl: '',
    hasQuiz: true,
    quiz: {
      title: 'Файлдық жүйе бойынша тест',
      questions: [
        {
          id: 1,
          question: '1. Файлдық жүйе дегеніміз не?',
          options: ['A) Экрандағы сурет', 'B) Деректерді сақтау мен ұйымдастыру тәсілі', 'C) Дыбыс жазу құрылғысы', 'D) Интернет браузері'],
          correctIndex: 1
        }
      ]
    }
  }
];

export default function App() {
  // Auth state
  const [user, setUser] = useState(null);
  const [currentUserProfile, setCurrentUserProfile] = useState(null);

  // App navigation state
  const [view, setView] = useState('home'); 
  const [selectedGrade, setSelectedGrade] = useState(6);
  const [selectedQuarter, setSelectedQuarter] = useState(1);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [lastQuizResult, setLastQuizResult] = useState(null);

  // Firestore Sync States
  const [lessons, setLessons] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [notification, setNotification] = useState(null);

  // Auth & Form inputs
  const [studentForm, setStudentForm] = useState({ name: '', grade: 6, letter: 'A', password: '' });
  const [teacherForm, setTeacherForm] = useState({ name: '', password: '' });

  // Quiz Taking local state
  const [userAnswers, setUserAnswers] = useState({});
  const [quizTimer, setQuizTimer] = useState(300);

  // Teacher Form State for creating/editing lessons
  const [editingLesson, setEditingLesson] = useState(null);
  const [lessonForm, setLessonForm] = useState({
    grade: 6,
    quarter: 1,
    order: 1,
    title: '',
    target: '',
    summary: '',
    pdfUrl: '',
    pptUrl: '',
    hasQuiz: false,
    quizTitle: '',
    questions: [
      { id: 1, question: '', options: ['', '', '', ''], correctIndex: 0 }
    ]
  });

  // Filters for Teacher Results Table
  const [filterGrade, setFilterGrade] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const showNotification = (msg, type = 'info') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Helper function to safely copy text without triggering Clipboard API Permission Policy block
  const copyToClipboard = (text) => {
    if (!text) return;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
          showNotification('Сілтеме көшіріп алынды!', 'success');
        }).catch(() => {
          fallbackCopyTextToClipboard(text);
        });
      } else {
        fallbackCopyTextToClipboard(text);
      }
    } catch (err) {
      fallbackCopyTextToClipboard(text);
    }
  };

  const fallbackCopyTextToClipboard = (text) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (successful) {
        showNotification('Сілтеме көшіріп алынды!', 'success');
      } else {
        window.prompt('Сілтемені көшіріп алыңыз (Ctrl+C / Cmd+C):', text);
      }
    } catch (err) {
      window.prompt('Сілтемені көшіріп алыңыз (Ctrl+C / Cmd+C):', text);
    }
  };

  // Helper to standardise download/open URLs
  const formatDownloadUrl = (url) => {
    if (!url) return '#';
    let cleanUrl = url.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://') && !cleanUrl.startsWith('data:')) {
      cleanUrl = 'https://' + cleanUrl;
    }
    return cleanUrl;
  };

  // 1. Firebase Auth listener
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Auth init error:", err);
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  // 2. Data Fetching via Firestore Snapshots
  useEffect(() => {
    if (!user) return;

    // Fetch Public Lessons
    const lessonsRef = collection(db, 'artifacts', appId, 'public', 'data', 'Lessons');
    const unsubLessons = onSnapshot(lessonsRef, (snapshot) => {
      let fetchedLessons = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Seed default 6th grade lessons if empty
      if (fetchedLessons.length === 0) {
        INITIAL_LESSONS_6_GRADE.forEach(async (l) => {
          await setDoc(doc(lessonsRef, l.id), l);
        });
        setLessons(INITIAL_LESSONS_6_GRADE);
      } else {
        fetchedLessons.sort((a, b) => a.order - b.order);
        setLessons(fetchedLessons);
      }
    }, (error) => {
      console.error("Error fetching lessons:", error);
    });

    // Fetch Public Test Results
    const resultsRef = collection(db, 'artifacts', appId, 'public', 'data', 'TestResults');
    const unsubResults = onSnapshot(resultsRef, (snapshot) => {
      let fetchedResults = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTestResults(fetchedResults);
    }, (error) => {
      console.error("Error fetching test results:", error);
    });

    return () => {
      unsubLessons();
      unsubResults();
    };
  }, [user]);

  // Quiz Timer logic
  useEffect(() => {
    let interval = null;
    if (view === 'take_quiz' && quizTimer > 0) {
      interval = setInterval(() => {
        setQuizTimer(prev => {
          if (prev <= 1) {
            handleFinishQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [view, quizTimer]);

  // ---------------------------------------------------------------------------
  // AUTHENTICATION LOGIC
  // ---------------------------------------------------------------------------
  const handleStudentRegister = async (e) => {
    e.preventDefault();
    if (!studentForm.name.trim() || !studentForm.password) {
      showNotification('Аты-жөніңізді және құпиясөзді енгізіңіз!', 'error');
      return;
    }

    const studentProfile = {
      uid: user ? user.uid : 'st_' + Date.now(),
      name: studentForm.name.trim(),
      role: 'student',
      grade: Number(studentForm.grade),
      letter: studentForm.letter.toUpperCase(),
      createdAt: new Date().toISOString()
    };

    try {
      if (user) {
        await setDoc(doc(db, 'artifacts', appId, 'users', user.uid), studentProfile);
      }
      setCurrentUserProfile(studentProfile);
      setSelectedGrade(studentProfile.grade);
      setView('student_dashboard');
      showNotification(`Қош келдіңіз, ${studentProfile.name}! 🚀`, 'success');
    } catch (err) {
      console.error(err);
      showNotification('Тіркелу кезінде қате шықты.', 'error');
    }
  };

  const handleTeacherRegister = async (e) => {
    e.preventDefault();
    const inputName = teacherForm.name.trim();

    // Strict Teacher Name Checking
    const isAuthorized = AUTHORIZED_TEACHERS.some(
      t => t.toLowerCase() === inputName.toLowerCase()
    );

    if (!isAuthorized) {
      showNotification('Сізге мұғалім ретінде тіркелуге рұқсат берілмеген. Әкімшімен хабарласыңыз!', 'error');
      return;
    }

    const teacherProfile = {
      uid: user ? user.uid : 'tch_' + Date.now(),
      name: inputName,
      role: 'teacher',
      createdAt: new Date().toISOString()
    };

    try {
      if (user) {
        await setDoc(doc(db, 'artifacts', appId, 'users', user.uid), teacherProfile);
      }
      setCurrentUserProfile(teacherProfile);
      setView('teacher_dashboard');
      showNotification(`Сәлеметсіз бе, ${teacherProfile.name}! Мұғалім кабинеті іске қосылды.`, 'success');
    } catch (err) {
      console.error(err);
      showNotification('Тіркелу кезінде қате туындады.', 'error');
    }
  };

  const handleQuickLogin = (role) => {
    if (role === 'teacher') {
      const teacherProfile = {
        uid: user ? user.uid : 'tch_master',
        name: 'Наурызбайқызы Жансая',
        role: 'teacher'
      };
      setCurrentUserProfile(teacherProfile);
      setView('teacher_dashboard');
      showNotification('Мұғалім болып кірдіңіз', 'success');
    } else {
      const studentProfile = {
        uid: user ? user.uid : 'st_sample',
        name: 'Айдос Ерланұлы',
        role: 'student',
        grade: 6,
        letter: 'A'
      };
      setCurrentUserProfile(studentProfile);
      setSelectedGrade(6);
      setView('student_dashboard');
      showNotification('Оқушы болып кірдіңіз', 'success');
    }
  };

  const handleLogout = () => {
    setCurrentUserProfile(null);
    setView('home');
    showNotification('Жүйеден шықтыңыз.', 'info');
  };

  // ---------------------------------------------------------------------------
  // QUIZ ENGINE LOGIC
  // ---------------------------------------------------------------------------
  const handleStartQuiz = (lesson) => {
    if (!lesson.quiz || !lesson.quiz.questions) {
      showNotification('Бұл сабақта тест әлі орналастырылмаған.', 'error');
      return;
    }
    setActiveQuiz(lesson);
    setUserAnswers({});
    setQuizTimer(300); // 5 mins
    setView('take_quiz');
  };

  const handleOptionSelect = (questionId, optionIndex) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleFinishQuiz = async () => {
    if (!activeQuiz) return;
    const questions = activeQuiz.quiz.questions;
    let correctCount = 0;

    questions.forEach(q => {
      if (userAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });

    const totalQuestions = questions.length;
    const percentage = Math.round((correctCount / totalQuestions) * 100);

    const resultPayload = {
      studentName: currentUserProfile ? currentUserProfile.name : 'Белгісіз Оқушы',
      grade: currentUserProfile ? `${currentUserProfile.grade}-${currentUserProfile.letter}` : `${selectedGrade}-Сынып`,
      studentUid: currentUserProfile ? currentUserProfile.uid : 'guest',
      lessonTitle: activeQuiz.title,
      quizTitle: activeQuiz.quiz.title || activeQuiz.title,
      score: correctCount,
      totalQuestions: totalQuestions,
      percentage: percentage,
      submittedAt: new Date().toLocaleDateString('kk-KZ') + ' ' + new Date().toLocaleTimeString('kk-KZ', { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now()
    };

    try {
      if (user) {
        const resultsRef = collection(db, 'artifacts', appId, 'public', 'data', 'TestResults');
        await addDoc(resultsRef, resultPayload);
      }
    } catch (e) {
      console.error("Error saving test result:", e);
    }

    setLastQuizResult(resultPayload);
    setView('quiz_result');
    showNotification('Тест аяқталды! Нәтижеңіз сақталды.', 'success');
  };

  // ---------------------------------------------------------------------------
  // TEACHER LESSON & QUIZ MANAGEMENT
  // ---------------------------------------------------------------------------
  const handleSaveLesson = async (e) => {
    e.preventDefault();
    if (!lessonForm.title.trim()) {
      showNotification('Сабақ тақырыбын енгізіңіз!', 'error');
      return;
    }

    const lessonData = {
      grade: Number(lessonForm.grade),
      quarter: Number(lessonForm.quarter),
      order: Number(lessonForm.order),
      title: lessonForm.title,
      target: lessonForm.target,
      summary: lessonForm.summary,
      pdfUrl: lessonForm.pdfUrl,
      pptUrl: lessonForm.pptUrl,
      hasQuiz: lessonForm.hasQuiz,
      quiz: lessonForm.hasQuiz ? {
        title: lessonForm.quizTitle || 'Сабақ бойынша тест',
        questions: lessonForm.questions
      } : null,
      updatedAt: new Date().toISOString()
    };

    try {
      const lessonsRef = collection(db, 'artifacts', appId, 'public', 'data', 'Lessons');
      if (editingLesson) {
        await updateDoc(doc(lessonsRef, editingLesson.id), lessonData);
        showNotification('Сабақ сәтті жаңартылды!', 'success');
      } else {
        const newDocRef = doc(lessonsRef, 'l_' + Date.now());
        await setDoc(newDocRef, { ...lessonData, id: newDocRef.id });
        showNotification('Жаңа сабақ қосылды және сақталды!', 'success');
      }
      setEditingLesson(null);
      resetLessonForm();
    } catch (err) {
      console.error(err);
      showNotification('Деректерді сақтау кезінде қате шықты.', 'error');
    }
  };

  const handleEditLesson = (lesson) => {
    setEditingLesson(lesson);
    setLessonForm({
      grade: lesson.grade,
      quarter: lesson.quarter,
      order: lesson.order,
      title: lesson.title,
      target: lesson.target || '',
      summary: lesson.summary || '',
      pdfUrl: lesson.pdfUrl || '',
      pptUrl: lesson.pptUrl || '',
      hasQuiz: !!lesson.hasQuiz,
      quizTitle: lesson.quiz?.title || '',
      questions: lesson.quiz?.questions || [{ id: 1, question: '', options: ['', '', '', ''], correctIndex: 0 }]
    });
    setView('teacher_dashboard');
  };

  const handleDeleteLesson = async (lessonId) => {
    if (window.confirm('Сабақты өшіруге сенімдісіз бе?')) {
      try {
        await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'Lessons', lessonId));
        showNotification('Сабақ өшірілді.', 'info');
      } catch (e) {
        console.error(e);
      }
    }
  };

  const resetLessonForm = () => {
    setEditingLesson(null);
    setLessonForm({
      grade: 6,
      quarter: 1,
      order: lessons.length + 1,
      title: '',
      target: '',
      summary: '',
      pdfUrl: '',
      pptUrl: '',
      hasQuiz: false,
      quizTitle: '',
      questions: [
        { id: 1, question: '', options: ['', '', '', ''], correctIndex: 0 }
      ]
    });
  };

  const addQuestionToForm = () => {
    setLessonForm(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        { id: prev.questions.length + 1, question: '', options: ['', '', '', ''], correctIndex: 0 }
      ]
    }));
  };

  // Filter lessons
  const filteredLessons = lessons.filter(
    l => Number(l.grade) === Number(selectedGrade) && Number(l.quarter) === Number(selectedQuarter)
  );

  // Filter Test Results for Teacher
  const filteredResults = testResults.filter(r => {
    const matchesGrade = filterGrade === 'all' || r.grade.includes(filterGrade);
    const matchesSearch = r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.lessonTitle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesGrade && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-5 right-5 z-50 p-4 rounded-xl shadow-2xl backdrop-blur-md flex items-center space-x-3 border transition-all duration-300 ${
          notification.type === 'error' ? 'bg-red-500/20 border-red-500 text-red-200' :
          notification.type === 'success' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200' :
          'bg-cyan-500/20 border-cyan-500 text-cyan-200'
        }`}>
          <Sparkles className="w-5 h-5 animate-spin" />
          <span className="text-sm font-medium">{notification.msg}</span>
        </div>
      )}

      {/* NAVBAR */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div 
            onClick={() => setView('home')} 
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-fuchsia-500 p-0.5 shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-black bg-gradient-to-r from-cyan-400 via-indigo-300 to-fuchsia-400 bg-clip-text text-transparent">
                AI BILIM
              </span>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Білім мен болашаққа жол!</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <button onClick={() => setView('home')} className="text-sm font-medium hover:text-cyan-400 transition-colors">Басты бет</button>
            <button onClick={() => { setView('student_dashboard'); setSelectedGrade(6); }} className="text-sm font-medium hover:text-cyan-400 transition-colors">Сыныптар</button>
            <button onClick={() => { setView('student_dashboard'); }} className="text-sm font-medium hover:text-cyan-400 transition-colors">Сабақтар</button>
          </nav>

          <div className="flex items-center space-x-3">
            {currentUserProfile ? (
              <div className="flex items-center space-x-3 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700">
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-200">{currentUserProfile.name}</p>
                  <p className="text-[10px] text-cyan-400 capitalize">
                    {currentUserProfile.role === 'teacher' ? 'Мұғалім' : `${currentUserProfile.grade}-${currentUserProfile.letter} сынып`}
                  </p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                  title="Шығу"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setView('login_student')}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-all"
                >
                  Оқушы ретінде кіру
                </button>
                <button 
                  onClick={() => setView('login_teacher')}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white shadow-lg shadow-indigo-500/20 transition-all"
                >
                  Мұғалім ретінде кіру
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* VIEW: HOME PAGE */}
        {view === 'home' && (
          <div className="space-y-16">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/20 p-8 sm:p-12 lg:p-16 text-center shadow-2xl">
              <div className="relative z-10 max-w-3xl mx-auto space-y-6">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-medium">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Информатика және жасанды интеллект платформасы</span>
                </div>
                <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
                  Білім ал. Зертте. Жаса. <br />
                  <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-fuchsia-400 bg-clip-text text-transparent">
                    Болашағыңды құр!
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-light">
                  Заманауи бағдарламалау, жасанды интеллект негіздері, киберқауіпсіздік және цифрлық сауаттылықты AI BILIM платформасымен бірге меңгеріңіз.
                </p>
                <div className="flex flex-wrap justify-center gap-4 pt-4">
                  <button 
                    onClick={() => {
                      if(currentUserProfile?.role === 'student') setView('student_dashboard');
                      else setView('login_student');
                    }}
                    className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/20 hover:scale-105 transition-all flex items-center space-x-2"
                  >
                    <span>Оқушы ретінде кіру</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => {
                      if(currentUserProfile?.role === 'teacher') setView('teacher_dashboard');
                      else setView('login_teacher');
                    }}
                    className="px-8 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-sm hover:scale-105 transition-all flex items-center space-x-2"
                  >
                    <UserCheck className="w-4 h-4 text-fuchsia-400" />
                    <span>Мұғалім ретінде кіру</span>
                  </button>
                </div>
              </div>
            </div>

            {/* GRADES CARDS SECTION */}
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-extrabold text-white">Сыныптар бойынша сабақтар</h2>
                <p className="text-slate-400 text-sm">5–11 сынып оқу бағдарламасы бойынша интерактивті сабақтар мен тесттер</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[5, 6, 7, 8, 9, 10, 11].map((gradeNum) => (
                  <div 
                    key={gradeNum}
                    className="group relative bg-slate-800/50 hover:bg-slate-800 border border-slate-700/80 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-black text-xl mb-4 group-hover:scale-110 transition-transform">
                        {gradeNum}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{gradeNum}-сынып</h3>
                      <p className="text-xs text-slate-400 mb-4">Информатика және ЖИ негіздері (1, 2, 3, 4 тоқсандар)</p>
                    </div>

                    <button 
                      onClick={() => {
                        setSelectedGrade(gradeNum);
                        if (!currentUserProfile) setView('login_student');
                        else setView('student_dashboard');
                      }}
                      className="w-full py-2.5 rounded-xl bg-slate-700/60 hover:bg-indigo-600 text-slate-200 hover:text-white font-medium text-xs transition-colors flex items-center justify-center space-x-1"
                    >
                      <span>Сабақтарды ашу</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW: STUDENT LOGIN / REGISTER */}
        {(view === 'login_student' || view === 'register_student') && (
          <div className="max-w-md mx-auto bg-slate-800/80 border border-slate-700 rounded-3xl p-8 backdrop-blur-xl shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-white">Оқушы кабинетіне кіру / Тіркелу</h2>
              <p className="text-xs text-slate-400">Аты-жөніңіз бен сыныбыңызды таңдаңыз</p>
            </div>

            <div className="flex bg-slate-900/60 p-1 rounded-xl text-xs font-semibold">
              <button 
                onClick={() => setView('register_student')} 
                className={`flex-1 py-2 rounded-lg transition-all ${view === 'register_student' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
              >
                Тіркелу
              </button>
              <button 
                onClick={() => handleQuickLogin('student')} 
                className="flex-1 py-2 rounded-lg text-slate-300 hover:text-white transition-all"
              >
                Демо Оқушы (Жылдам)
              </button>
            </div>

            <form onSubmit={handleStudentRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Аты-жөніңіз</label>
                <input 
                  type="text" 
                  required
                  placeholder="Мәселен: Айдос Ерланұлы"
                  value={studentForm.name}
                  onChange={e => setStudentForm({ ...studentForm, name: e.target.value })}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Сынып</label>
                  <select 
                    value={studentForm.grade}
                    onChange={e => setStudentForm({ ...studentForm, grade: e.target.value })}
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    {[5,6,7,8,9,10,11].map(g => (
                      <option key={g} value={g}>{g}-сынып</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Литерасы</label>
                  <input 
                    type="text" 
                    maxLength={2}
                    placeholder="А, Б, В"
                    value={studentForm.letter}
                    onChange={e => setStudentForm({ ...studentForm, letter: e.target.value })}
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Құпиясөз</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  value={studentForm.password}
                  onChange={e => setStudentForm({ ...studentForm, password: e.target.value })}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 font-bold text-sm text-white shadow-lg shadow-cyan-500/20 transition-all"
              >
                Тіркелу және Кабинетке кіру
              </button>
            </form>
          </div>
        )}

        {/* VIEW: TEACHER LOGIN / REGISTER */}
        {(view === 'login_teacher' || view === 'register_teacher') && (
          <div className="max-w-md mx-auto bg-slate-800/80 border border-slate-700 rounded-3xl p-8 backdrop-blur-xl shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-black text-white">Мұғалім кабинетіне кіру</h2>
              <p className="text-xs text-amber-400 font-medium">⚠️ Тек рұқсат берілген мұғалімдер тіркеле алады</p>
            </div>

            <div className="flex bg-slate-900/60 p-1 rounded-xl text-xs font-semibold">
              <button 
                onClick={() => setView('register_teacher')} 
                className="flex-1 py-2 rounded-lg bg-indigo-600 text-white transition-all"
              >
                Аты-жөні арқылы кіру
              </button>
              <button 
                onClick={() => handleQuickLogin('teacher')} 
                className="flex-1 py-2 rounded-lg text-slate-300 hover:text-white transition-all"
              >
                Тікелей тестілеу (Наурызбайқызы Жансая)
              </button>
            </div>

            <form onSubmit={handleTeacherRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Мұғалімнің толық аты-жөні</label>
                <input 
                  type="text" 
                  required
                  placeholder="Мәселен: Наурызбайқызы Жансая"
                  value={teacherForm.name}
                  onChange={e => setTeacherForm({ ...teacherForm, name: e.target.value })}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Рұқсат етілген аты-жөндер: <span className="text-cyan-400 font-semibold">Наурызбайқызы Жансая</span>
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Құпиясөз</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  value={teacherForm.password}
                  onChange={e => setTeacherForm({ ...teacherForm, password: e.target.value })}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 font-bold text-sm text-white shadow-lg shadow-indigo-500/20 transition-all"
              >
                Серверлік Тексеру & Кіру
              </button>
            </form>
          </div>
        )}

        {/* VIEW: STUDENT DASHBOARD */}
        {view === 'student_dashboard' && (
          <div className="space-y-8">
            <div className="bg-slate-800/60 border border-slate-700 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Сәлем, {currentUserProfile ? currentUserProfile.name : 'Оқушы'}! 👋
                </h2>
                <p className="text-xs text-slate-400">
                  Сынып: <span className="text-cyan-400 font-semibold">{selectedGrade}-сынып</span> | Бағдарлама: Информатика және ЖИ
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {[5, 6, 7, 8, 9, 10, 11].map(g => (
                  <button
                    key={g}
                    onClick={() => setSelectedGrade(g)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      Number(selectedGrade) === g 
                        ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-cyan-500/20'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {g}-сынып
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-3 bg-slate-800/40 p-2 rounded-2xl border border-slate-800 w-fit">
              <span className="text-xs text-slate-400 font-medium px-2">Тоқсан:</span>
              {[1, 2, 3, 4].map(q => (
                <button
                  key={q}
                  onClick={() => setSelectedQuarter(q)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    Number(selectedQuarter) === q
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {q}-тоқсан
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">
                  {selectedGrade}-сынып, {selectedQuarter}-тоқсан сабақтары
                </h3>
                <span className="text-xs text-slate-400">{filteredLessons.length} сабақ бар</span>
              </div>

              {filteredLessons.length === 0 ? (
                <div className="text-center py-12 bg-slate-800/30 rounded-2xl border border-dashed border-slate-700">
                  <p className="text-sm text-slate-400">Бұл тоқсанға арналған сабақтар әлі енгізілмеген.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredLessons.map((lesson) => (
                    <div 
                      key={lesson.id}
                      className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:border-indigo-500/50 transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 text-[10px] font-bold tracking-wide">
                            №{lesson.order} САБАҚ
                          </span>
                          <div className="flex items-center space-x-2">
                            {currentUserProfile?.role === 'teacher' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditLesson(lesson);
                                }}
                                className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors"
                                title="Сабақты өңдеу"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            )}
                            {lesson.hasQuiz && (
                              <span className="px-2.5 py-1 rounded-lg bg-fuchsia-500/10 text-fuchsia-400 text-[10px] font-bold flex items-center space-x-1">
                                <Award className="w-3 h-3" />
                                <span>Тест бар</span>
                              </span>
                            )}
                          </div>
                        </div>

                        <h4 className="text-lg font-bold text-white leading-snug">{lesson.title}</h4>

                        {lesson.target && (
                          <div className="text-xs text-slate-300 bg-slate-900/50 p-3 rounded-xl border border-slate-800/80">
                            <span className="font-semibold text-cyan-400">Оқу мақсаты: </span>
                            {lesson.target}
                          </div>
                        )}
                      </div>

                      <div className="pt-2 flex items-center space-x-3">
                        <button 
                          onClick={() => {
                            setSelectedLesson(lesson);
                            setView('lesson_detail');
                          }}
                          className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center justify-center space-x-1"
                        >
                          <BookOpen className="w-4 h-4" />
                          <span>Сабақты ашу</span>
                        </button>

                        {lesson.hasQuiz && (
                          <button 
                            onClick={() => handleStartQuiz(lesson)}
                            className="py-2.5 px-4 rounded-xl bg-fuchsia-600/20 hover:bg-fuchsia-600 border border-fuchsia-500/30 text-fuchsia-300 hover:text-white font-semibold text-xs transition-colors flex items-center space-x-1"
                          >
                            <Play className="w-3.5 h-3.5" />
                            <span>Тест орындау</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW: LESSON DETAIL */}
        {view === 'lesson_detail' && selectedLesson && (
          <div className="max-w-4xl mx-auto space-y-8">
            <button 
              onClick={() => setView('student_dashboard')}
              className="text-xs text-slate-400 hover:text-white flex items-center space-x-1"
            >
              <span>← Сабақтар тізіміне қайту</span>
            </button>

            <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-8 space-y-6">
              <div className="border-b border-slate-700 pb-6 flex items-start justify-between">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    {selectedLesson.grade}-сынып • {selectedLesson.quarter}-тоқсан
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-white">{selectedLesson.title}</h1>
                </div>
                {currentUserProfile?.role === 'teacher' && (
                  <button
                    onClick={() => handleEditLesson(selectedLesson)}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 text-xs font-semibold flex items-center space-x-1 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Өңдеу</span>
                  </button>
                )}
              </div>

              {selectedLesson.target && (
                <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-2xl p-5 space-y-1">
                  <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Оқу мақсаты</h4>
                  <p className="text-sm text-slate-200">{selectedLesson.target}</p>
                </div>
              )}

              {selectedLesson.summary && (
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-white">Сабақ туралы қысқаша ақпарат</h4>
                  <p className="text-sm text-slate-300 leading-relaxed">{selectedLesson.summary}</p>
                </div>
              )}

              <div className="space-y-3 pt-4 border-t border-slate-700">
                <h4 className="text-sm font-bold text-white">Оқу материалдары мен файлдар</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedLesson.pdfUrl ? (
                    <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:border-indigo-500/40 transition-colors">
                      <div className="flex items-center space-x-3 overflow-hidden">
                        <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400 shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-bold text-slate-200 truncate">PDF / Оқу материалы</p>
                          <p className="text-[10px] text-slate-500 truncate" title={selectedLesson.pdfUrl}>
                            {selectedLesson.pdfUrl}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 pt-2 border-t border-slate-800">
                        <a 
                          href={formatDownloadUrl(selectedLesson.pdfUrl)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          download
                          className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors shadow-lg shadow-indigo-600/20"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Файлды жүктеу</span>
                        </a>
                        <button
                          onClick={() => copyToClipboard(selectedLesson.pdfUrl)}
                          className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
                          title="Сілтемені көшіру"
                        >
                          Сілтеме
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 text-xs text-slate-500 italic flex items-center justify-center">
                      PDF файл қосылмаған
                    </div>
                  )}

                  {selectedLesson.pptUrl ? (
                    <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:border-orange-500/40 transition-colors">
                      <div className="flex items-center space-x-3 overflow-hidden">
                        <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400 shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-bold text-slate-200 truncate">Презентация (PPTX)</p>
                          <p className="text-[10px] text-slate-500 truncate" title={selectedLesson.pptUrl}>
                            {selectedLesson.pptUrl}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 pt-2 border-t border-slate-800">
                        <a 
                          href={formatDownloadUrl(selectedLesson.pptUrl)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          download
                          className="flex-1 py-2 px-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors shadow-lg shadow-orange-600/20"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Презентацияны жүктеу</span>
                        </a>
                        <button
                          onClick={() => copyToClipboard(selectedLesson.pptUrl)}
                          className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
                          title="Сілтемені көшіру"
                        >
                          Сілтеме
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 text-xs text-slate-500 italic flex items-center justify-center">
                      Презентация қосылмаған
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: TAKE QUIZ */}
        {view === 'take_quiz' && activeQuiz && activeQuiz.quiz && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">{activeQuiz.quiz.title}</h2>
                <p className="text-xs text-slate-400">{activeQuiz.title}</p>
              </div>

              <div className="flex items-center space-x-2 bg-slate-900/80 px-4 py-2 rounded-2xl border border-slate-700">
                <Clock className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-mono font-bold text-amber-300">
                  {Math.floor(quizTimer / 60)}:{('0' + (quizTimer % 60)).slice(-2)}
                </span>
              </div>
            </div>

            <div className="space-y-6">
              {activeQuiz.quiz.questions.map((q) => (
                <div key={q.id} className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6 space-y-4">
                  <p className="text-sm font-bold text-white">{q.question}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = userAnswers[q.id] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleOptionSelect(q.id, optIdx)}
                          className={`p-3.5 rounded-xl border text-left text-xs font-medium transition-all ${
                            isSelected 
                              ? 'bg-indigo-600/30 border-indigo-500 text-white' 
                              : 'bg-slate-900/50 border-slate-700/80 text-slate-300 hover:border-slate-600'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4">
              <button 
                onClick={handleFinishQuiz}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white font-bold text-sm shadow-xl shadow-emerald-500/20 transition-all"
              >
                Тестті аяқтау және нәтижені сақтау
              </button>
            </div>
          </div>
        )}

        {/* VIEW: QUIZ RESULT */}
        {view === 'quiz_result' && lastQuizResult && (
          <div className="max-w-md mx-auto bg-slate-800/90 border border-slate-700 rounded-3xl p-8 backdrop-blur-xl text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-black text-white">Тест аяқталды! Жарайсың!</h2>
              <p className="text-xs text-slate-400">Нәтижеңіз серверде сәтті сақталды</p>
            </div>

            <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-700 space-y-3 text-left">
              <div className="flex justify-between text-xs py-1 border-b border-slate-800">
                <span className="text-slate-400">Оқушы:</span>
                <span className="font-bold text-white">{lastQuizResult.studentName} ({lastQuizResult.grade})</span>
              </div>
              <div className="flex justify-between text-xs py-1 border-b border-slate-800">
                <span className="text-slate-400">Тест тақырыбы:</span>
                <span className="font-bold text-cyan-400">{lastQuizResult.quizTitle}</span>
              </div>
              <div className="flex justify-between text-xs py-1 border-b border-slate-800">
                <span className="text-slate-400">Дұрыс жауап:</span>
                <span className="font-bold text-emerald-400">{lastQuizResult.score} / {lastQuizResult.totalQuestions}</span>
              </div>
              <div className="flex justify-between text-xs py-1">
                <span className="text-slate-400">Пайыздық көрсеткіш:</span>
                <span className="font-bold text-fuchsia-400">{lastQuizResult.percentage}%</span>
              </div>
            </div>

            <button 
              onClick={() => setView('student_dashboard')}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors"
            >
              Басты кабинетке қайту
            </button>
          </div>
        )}

        {/* VIEW: TEACHER DASHBOARD */}
        {view === 'teacher_dashboard' && (
          <div className="space-y-10">
            <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-fuchsia-500/10 text-fuchsia-400 text-[10px] font-bold">
                  <UserCheck className="w-3 h-3" />
                  <span>МҰҒАЛІМ КУРАТОРЫ</span>
                </div>
                <h2 className="text-2xl font-black text-white">
                  {currentUserProfile ? currentUserProfile.name : 'Наурызбайқызы Жансая'}
                </h2>
                <p className="text-xs text-slate-400">Сабақтарды басқару, тест құрастыру және оқушылардың нәтижелерін бағалау</p>
              </div>

              <div className="flex items-center space-x-3">
                <button 
                  onClick={resetLessonForm}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all flex items-center space-x-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Жаңа сабақ қосу</span>
                </button>
              </div>
            </div>

            {/* CREATE / EDIT LESSON FORM */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Edit className="w-4 h-4 text-cyan-400" />
                  <span>{editingLesson ? 'Сабақты өңдеу' : 'Жаңа сабақ & Тест құрастыру'}</span>
                </h3>
                {editingLesson && (
                  <button onClick={resetLessonForm} className="text-xs text-red-400 hover:underline">
                    Бас тарту
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveLesson} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Сынып</label>
                    <select 
                      value={lessonForm.grade}
                      onChange={e => setLessonForm({ ...lessonForm, grade: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white"
                    >
                      {[5,6,7,8,9,10,11].map(g => <option key={g} value={g}>{g}-сынып</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Тоқсан</label>
                    <select 
                      value={lessonForm.quarter}
                      onChange={e => setLessonForm({ ...lessonForm, quarter: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white"
                    >
                      {[1,2,3,4].map(q => <option key={q} value={q}>{q}-тоқсан</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Сабақ реттік саны (№)</label>
                    <input 
                      type="number"
                      value={lessonForm.order}
                      onChange={e => setLessonForm({ ...lessonForm, order: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Сабақ тақырыбы</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Сабақ атауын енгізіңіз..."
                    value={lessonForm.title}
                    onChange={e => setLessonForm({ ...lessonForm, title: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Оқу мақсаты</label>
                  <input 
                    type="text" 
                    placeholder="Мәселен: 6.4.1.1 желідегі техника қауіпсіздігі ережелері..."
                    value={lessonForm.target}
                    onChange={e => setLessonForm({ ...lessonForm, target: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Қысқаша мазмұны</label>
                  <textarea 
                    rows={3}
                    placeholder="Сабақтың негізгі түсініктері..."
                    value={lessonForm.summary}
                    onChange={e => setLessonForm({ ...lessonForm, summary: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">PDF Файл сілтемесі</label>
                    <input 
                      type="text" 
                      placeholder="https://... немесе файл сілтемесі"
                      value={lessonForm.pdfUrl}
                      onChange={e => setLessonForm({ ...lessonForm, pdfUrl: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Презентация (PPTX) сілтемесі</label>
                    <input 
                      type="text" 
                      placeholder="https://... немесе файл сілтемесі"
                      value={lessonForm.pptUrl}
                      onChange={e => setLessonForm({ ...lessonForm, pptUrl: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white"
                    />
                  </div>
                </div>

                {/* QUIZ BUILDER */}
                <div className="pt-4 border-t border-slate-700 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={lessonForm.hasQuiz}
                        onChange={e => setLessonForm({ ...lessonForm, hasQuiz: e.target.checked })}
                        className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-0 w-4 h-4"
                      />
                      <span className="text-xs font-bold text-white">Сабаққа тест қосу</span>
                    </label>
                  </div>

                  {lessonForm.hasQuiz && (
                    <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-700 space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Тест атауы</label>
                        <input 
                          type="text" 
                          placeholder="Тест тақырыбы..."
                          value={lessonForm.quizTitle}
                          onChange={e => setLessonForm({ ...lessonForm, quizTitle: e.target.value })}
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>

                      <div className="space-y-4">
                        <label className="block text-xs font-bold text-slate-200">Тест сұрақтары</label>

                        {lessonForm.questions.map((q, qIndex) => (
                          <div key={q.id} className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-3">
                            <input 
                              type="text" 
                              placeholder={`Сұрақ ${qIndex + 1}...`}
                              value={q.question}
                              onChange={e => {
                                const updated = [...lessonForm.questions];
                                updated[qIndex].question = e.target.value;
                                setLessonForm({ ...lessonForm, questions: updated });
                              }}
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                            />

                            <div className="grid grid-cols-2 gap-2">
                              {q.options.map((opt, optIndex) => (
                                <input 
                                  key={optIndex}
                                  type="text"
                                  placeholder={`Нұсқа ${String.fromCharCode(65 + optIndex)}`}
                                  value={opt}
                                  onChange={e => {
                                    const updated = [...lessonForm.questions];
                                    updated[qIndex].options[optIndex] = e.target.value;
                                    setLessonForm({ ...lessonForm, questions: updated });
                                  }}
                                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                                />
                              ))}
                            </div>

                            <div className="flex items-center space-x-2">
                              <span className="text-[11px] text-slate-400">Дұрыс жауап индексі:</span>
                              <select 
                                value={q.correctIndex}
                                onChange={e => {
                                  const updated = [...lessonForm.questions];
                                  updated[qIndex].correctIndex = Number(e.target.value);
                                  setLessonForm({ ...lessonForm, questions: updated });
                                }}
                                className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
                              >
                                <option value={0}>A нұсқасы</option>
                                <option value={1}>B нұсқасы</option>
                                <option value={2}>C нұсқасы</option>
                                <option value={3}>D нұсқасы</option>
                              </select>
                            </div>
                          </div>
                        ))}

                        <button 
                          type="button"
                          onClick={addQuestionToForm}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-indigo-400"
                        >
                          + Тағы сұрақ қосу
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-2">
                  <button 
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white font-bold text-xs shadow-lg shadow-emerald-500/20"
                  >
                    Дерекқорға сақтау (Firebase Firestore)
                  </button>
                </div>
              </form>
            </div>

            {/* RESULTS TABLE */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                    <Award className="w-5 h-5 text-fuchsia-400" />
                    <span>Оқушылардың тест нәтижелері (Тұрақты сақтау)</span>
                  </h3>
                  <p className="text-xs text-slate-400">Оқушылардан келген барлық нәтижелер бұлтта сақталады</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                    <input 
                      type="text" 
                      placeholder="Оқушы атын іздеу..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <select 
                    value={filterGrade}
                    onChange={e => setFilterGrade(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                  >
                    <option value="all">Барлық сыныптар</option>
                    {[5,6,7,8,9,10,11].map(g => <option key={g} value={`${g}`}>{g}-сынып</option>)}
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-700 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-3 px-4">№</th>
                      <th className="py-3 px-4">Оқушының аты-жөні</th>
                      <th className="py-3 px-4">Сыныбы</th>
                      <th className="py-3 px-4">Тест тақырыбы</th>
                      <th className="py-3 px-4">Ұпайы</th>
                      <th className="py-3 px-4">Пайыз</th>
                      <th className="py-3 px-4">Тапсырған уақыты</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-xs text-slate-200">
                    {filteredResults.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-500 italic">
                          Нәтижелер әлі тіркелмеген немесе іздеу бойынша табылмады.
                        </td>
                      </tr>
                    ) : (
                      filteredResults.map((res, index) => (
                        <tr key={res.id || index} className="hover:bg-slate-800/50 transition-colors">
                          <td className="py-3 px-4 text-slate-500">{index + 1}</td>
                          <td className="py-3 px-4 font-semibold text-white">{res.studentName}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-bold">
                              {res.grade}
                            </span>
                          </td>
                          <td className="py-3 px-4 max-w-xs truncate">{res.quizTitle || res.lessonTitle}</td>
                          <td className="py-3 px-4 font-bold text-emerald-400">
                            {res.score} / {res.totalQuestions}
                          </td>
                          <td className="py-3 px-4 font-bold text-fuchsia-400">{res.percentage}%</td>
                          <td className="py-3 px-4 text-slate-400 text-[11px]">{res.submittedAt}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* MANAGED LESSONS LIST */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-3xl p-6 sm:p-8 space-y-4">
              <h3 className="text-lg font-bold text-white">Қолданыстағы сабақтар тізімі ({lessons.length})</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lessons.map(l => (
                  <div key={l.id} className="bg-slate-900/80 border border-slate-700/80 p-4 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-indigo-400">{l.grade}-сынып • {l.quarter}-тоқсан</span>
                      <h4 className="text-sm font-bold text-white truncate max-w-xs">{l.title}</h4>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleEditLesson(l)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 transition-colors"
                        title="Өңдеу"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteLesson(l.id)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-red-400 transition-colors"
                        title="Өшіру"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p>© 2026 AI BILIM — Информатика және жасанды интеллект платформасы. Барлық құқықтар қорғалған.</p>
          <p className="text-[10px] text-slate-600">Қазақстан Республикасы білім беру стандартына сәйкес дайындалған.</p>
        </div>
      </footer>
    </div>
  );
}