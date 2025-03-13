import { useState, useEffect } from "react";

import { copy, animated, tick } from "../../assets";
import { useLazyGetSummaryQuery } from "../../services/article";
import "./Home.css";
const Home = () => {
  const [article, setArticle] = useState({
    url: "",
    summary: "",
  });

  const [allArticles, setAllArticles] = useState([]);
  const [copied, setCopied] = useState("");

  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(
      localStorage.getItem("articles")
    );

    if (articlesFromLocalStorage) {
      setAllArticles(articlesFromLocalStorage);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data } = await getSummary({ articleUrl: article.url });

    if (data?.summary) {
      const newArticle = { ...article, summary: data.summary };
      const updatedAllArticles = [newArticle, ...allArticles];

      setArticle(newArticle);
      setAllArticles(updatedAllArticles);

      localStorage.setItem("articles", JSON.stringify(updatedAllArticles));
    }
  };

  const handleCopy = (copyUrl) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleSubmit(e);
    }
  };
  return (
    <section className=" w-full  pl-[10%] pr-[10%]   pt-[5%] ">
      <div className="bg-[#FFFFFF] rounded-xl pb-[3%] h-[100%]">
        {/* text */}
        <div className="pt-16">
          <h1 className="text-3xl leading-tight md:text-4xl xl:text-4.5xl text-black dark:text-white text-center font-bold md:!leading-snug mb-2">
            Welcome to Summarize
          </h1>
          <p className="w-full flex items-center gap-2 justify-center text-xl md:text-2xl text-black/60 dark:text-white text-center">
            Get started by adding your first paper or
            <button className="text-purple-400">view example</button>
          </p>
          <div className="flex items-center justify-center">
            <div
              role="presentation"
              tabIndex={0}
              className="bg-purple-400 dark:bg-dark-350 dark:border-none flex flex-col items-center justify-center w-full max-w-[600px] h-52 my-6 p-6 dark:text-white border rounded-2xl bg-glow justify-center transition-all ease-in-out duration-300"
            >
              <input
                accept="application/x-tex,.tex,text/rtf,.rtf,application/rtf,.rtf,text/html,.html,.htm,text/xml,.nxml,application/xml,.nxml,application/pdf,.pdf,application/x-pdf,.pdf,application/acrobat,.pdf,applications/vnd.pdf,.pdf,text/pdf,.pdf,text/x-pdf,.pdf,text/plain,.txt,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.docx,application/msword,.doc,application/vnd.openxmlformats-officedocument.presentationml.presentation,.pptx,application/epub+zip,.epub,application/vnd.oasis.opendocument.text,.odt,text/markdown,.md,text/csv,.csv,application/x-research-info-systems,.ris,application/x-bibtex,.bib,.bibtex,application/x-pubmed,.nbib"
                multiple
                type="file"
                style={{ display: "none" }}
                tabIndex={-1}
              />
              <form onSubmit={handleSubmit} className="relative w-full p-20">
                <input
                  type="text"
                  placeholder="Paste the article link"
                  className="h-fit w-full sm:h-11 xl:h-12 px-3 xl:py-2 rounded-2xl text-base xl:text-lg font-bold leading-8 text-purple-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
                  value={article.url}
                  onChange={(e) =>
                    setArticle({ ...article, url: e.target.value })
                  }
                  onKeyDown={handleKeyDown}
                  required
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-24 flex items-center text-purple-500  text-2xl"
                >
                  ↵
                </button>
              </form>
            </div>
          </div>
          {/* Browse History */}
          <div className="flex justify-center flex-col gap-1 max-h-60 overflow-y-auto">
            {allArticles.slice(-1).map((item, index) => (
              <div
                key={`link-${index}`}
                onClick={() => setArticle(item)}
                className="flex items-center gap-2 justify-center"
              >
                <div className="" onClick={() => handleCopy(item.url)}>
                  <img
                    src={copied === item.url ? tick : copy}
                    alt="copy_icon"
                    className="w-[18px] h-[18px] object-contain"
                  />
                </div>
                <p className="cursor-pointer text-purple-500 font-medium text-md truncate">
                  {item.url}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Display Result */}
        <div className="my-10 w-full flex justify-center items-center">
          <div className="w-[700px] flex justify-center ">
            {isFetching ? (
              <img
                src={animated}
                alt="animated"
                className="w-20 h-20 object-contain"
              />
            ) : error ? (
              <p className="font-inter font-bold text-black text-center">
                Well, that wasnt supposed to happen...
                <br />
                <span className="text-gray-700">{error?.data?.error}</span>
              </p>
            ) : (
              article.summary && (
                <div className="flex flex-col gap-3">
                  <h2 className="font-bold text-gray-600 text-xl">
                    Article <span className="blue_gradient">Summary</span>
                  </h2>
                  <div className="summary_box">
                    <p className="font-inter font-medium text-sm text-gray-700">
                      {article.summary}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
