import classnames from "classnames";
import styles from "./Story.module.css";
import $ from "jquery";
import Turn from "./Turn";
import books from "../books";
import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const options = {
  width: 1080,
  height: 607,
  autoCenter: true,
  acceleration: true,
  display: "double",
  elevation: 50,
  page: 2,
  gradients: !$.isTouch,
  when: {
    turned: function (e, page) {
      console.log("Current view: ", $(this).turn("view"));
    },
  },
};

export default function Story() {
  const navigate = useNavigate();
  const [frames, setFrames] = useState([]);
  const [coverPage, setCoverPage] = useState("");
  const [backPage, setBackPage] = useState("");

  useEffect(() => {
    const book = books.find(1);
    const story = book.stories[0];
    const pages = story.pages.filter((s) => s.branch === "default");
    setFrames(pages);
    setCoverPage(book.cover_page);
    setBackPage(book.back_page);
    console.log("effect:" + pages);
  }, []);

  return (
    <div className={styles.story}>
      <div className={styles.storyContent}>
        {frames.length > 0 && (
          <Turn options={options} className="magazine">
            {coverPage && (
              <div key={`cover`} className="page">
                <div
                  className={classnames(styles.page)}
                  style={{ backgroundImage: coverPage }}
                ></div>
              </div>
            )}
            {frames.map((page) => (
              <Fragment key={`${page.index}`}>
                <div key={`${page.index}_left`} className="page">
                  <div
                    className={classnames(styles.page, styles.page_left)}
                    style={{ backgroundImage: page.pic }}
                  ></div>
                  {page.text && (
                    <p className={classnames(styles.text, "text-2xl")}>
                      {page.text}
                    </p>
                  )}
                </div>
                <div key={`${page.index}_right`} className="page">
                  <div
                    className={classnames(styles.page, styles.page_right)}
                    style={{ backgroundImage: page.pic }}
                  ></div>
                  {page.switch && page.switch.length > 0 && (
                    <div className={styles.switch}>
                      {page.switch.map((s, i) => (
                        <div
                          key={i}
                          className={classnames(
                            "rounded-full",
                            "text-3xl",
                            "text-center",
                            styles.switchItem
                          )}
                          onClick={() => {
                            navigate(
                              `/books/1/stories/1/branch/${s.goto.branch}`
                            );
                          }}
                        >
                          {s.q}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Fragment>
            ))}
            {backPage && (
              <div key={`back`} className="page">
                <div
                  className={classnames(styles.page)}
                  style={{ backgroundImage: backPage }}
                ></div>
              </div>
            )}
          </Turn>
        )}
      </div>
    </div>
  );
}
