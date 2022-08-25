import "./App.css";
import { useState } from "react";
import axios from "axios";

const apiRoute = "http://localhost:5050/api/crawl-links";

function App() {
  const [domain, setDomain] = useState("");
  const [waiting, setWaiting] = useState("");
  const [linksData, setLinksData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const getLinks = async (e) => {
    e.preventDefault();

    setLinksData();
    setError(false);
    setLoading(true);

    const options = {
      method: "POST",
      data: {
        domain,
        ...(waiting && { waiting }),
      },
    };

    try {
      const response = await axios(apiRoute, options);
      const data = await response.data;
      setLinksData(data.linksData);
    } catch (error) {
      console.log(error);
      setLinksData();
      setError(true);
    }

    setLoading(false);
  };

  const resetPage = (e) => {
    e.preventDefault();

    setLinksData();
    setDomain("");
    setWaiting("");
    setError(false);
    setLoading(false);
  };

  return (
    <div className="app">
      <form onSubmit={(e) => getLinks(e)}>
        <div className="inputDiv">
          <div>
            <label>Domain* :</label>
            <input
              type="text"
              placeholder="Input domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Waiting Time (in second):</label>
            <input
              type="number"
              value={waiting}
              placeholder="Input waiting time in second"
              onChange={(e) => setWaiting(e.target.value)}
            />
          </div>
        </div>
        <div>
          <button type="submit">Crawl</button>
          <button onClick={(e) => resetPage(e)}>Reset</button>
        </div>
      </form>
      {loading && <div>Crawling...</div>}
      {error && <div>Something went wrong.</div>}
      {linksData && (
        <div className="table">
          <div className="row heading">
            <p className="cell">ID</p>
            <p className="cell">Link</p>
            <p className="cell">Title</p>
            <p className="cell">Frequency</p>
          </div>
          <div className="rowCollection">
            {linksData.map((item, index) => (
              <div className="row" key={index}>
                <p className="cell">{index + 1}</p>
                <a className="cell" href={item.link} target="_blank">
                  {item.link}
                </a>
                <p className="cell">{item.title}</p>
                <p className="cell">{item.frequency}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
