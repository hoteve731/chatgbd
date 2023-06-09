import { useState, useEffect } from "react";
import axios from "axios";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import loaderStyles from "../styles/loader.module.css";
import Navbar from '../components/Navbar';
import { useRouter } from "next/router"; // 추가: useRouter 불러오기
import { auth } from "../lib/firebase";

const linkifyAnswer = (answer) => {
  const urlRegex = /https?:\/\/[^\s]+/g;
  return answer.replace(urlRegex, (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`);
};

export default function Home() {
  const [question, setQuestion] = useState("");
  const [submittedQuestion, setSubmittedQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [relevantFacts, setRelevantFacts] = useState([]);

  useEffect(() => {
    // Fetch data or perform any action on component mount
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (question === submittedQuestion) {
      return;
    }
    setLoading(true);
    setSubmittedQuestion(question);
    try {
      const response = await axios.post("/api/chat", { question });
      setAnswer(response.data.answer);
      setQuestion("");

      setAnswer(response.data.answer);
      setRelevantFacts(response.data.relevantFacts || []);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setAnswer("질문을 입력해주세요.");
      } else {
        setAnswer("문제가 발생했습니다. 나중에 다시 시도해주세요.");
      }
      console.error("Error occurred:", error);
      setRelevantFacts([]);
    } finally {
      setLoading(false);
    }
  };
  
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setSubmittedQuestion(question);
  //   const response = await axios.post("/api/chat", { question });
  //   setAnswer(response.data.answer);
  //   setQuestion("");
  //   setLoading(false);
    
  // };

  const router = useRouter();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  const handleFocus = (e) => {
    e.target.value = "";
    // e.target.select();
  };

  // const handleChange = (e) => {
  //   if (e.target.value !== submittedQuestion) {
  //     setSubmittedQuestion("");
  //   }
  //   setQuestion(e.target.value);
  // };
  const handleChange = (e) => {
    setSubmittedQuestion("");
    setQuestion(e.target.value);
  };
  
  return (
    <>
      <Navbar />
    
  
    <div className="container">
      
     
    
    
      <Head>
        <title>ChatGBD</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
      </Head>
      
      
    
      <h1 className="mainlogo">ChatGBD</h1>
      <form onSubmit={handleSubmit}>
        <input
          id="question"
          type="text"
          value={question || submittedQuestion}
          onChange={handleChange}
          onFocus={handleFocus}
          required
          aria-label="Enter your question"
          className="maininput"
        />
        <button type="submit" aria-label="Submit your question">
          물어보기
        </button>
      </form>
      {loading && <div className={loaderStyles.loader}></div>}
      
      {answer && (
        <div className="answer">
          
          <h4 className="dap">AI의 답</h4>
          <p
            className="answertext"
            dangerouslySetInnerHTML={{
              __html: linkifyAnswer(answer),
            }}
          ></p>
          
          {relevantFacts.length > 0 && (
        <div className="relevant-facts">
          <h4 className="relevanttitle">AI가 참고한 정보</h4>
          <ul className="relevanttext">
            {relevantFacts.map((fact, index) => (
              <li dangerouslySetInnerHTML={{ __html: fact }}></li>
            ))}
          </ul>
        </div>
      )}



        </div>
      )}
      <h6>
      <br />
        인공지능이 생성한 답변은 부정확할 수 있습니다. <br />검증된 정보들로만 학습시켜 주세요.
        <br /><br />
        '정보 모두보기'에서 인공지능이 학습한 <br />모든 정보들을 보실 수 있습니다. 
        <br /><br />
      </h6>
      <br />
      <a href="https://www.notion.so/hoteve731/ChatGBD-b0d57daf9aef422e868b919fd434d2d3?pvs=4" target="_blank" id="help-link"><i class="fas fa-question-circle"></i></a>
      <h5>Help</h5>


     
    </div>
    </>
  );
}