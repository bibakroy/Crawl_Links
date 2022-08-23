import "./App.css";
import { useState } from "react";
import axios from "axios";

function App() {
  const [linksData, setLinksData] = useState();
  const [waiting, setWaiting] = useState();
  const [domain, setDomain] = useState("https://www.w3schools.com/");
  // const [domain, setDomain] = useState("http://127.0.0.1:5500/");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const getLinks = async (e) => {
    e.preventDefault();
    if (waiting > 30) return;

    setLinksData();
    setError(false);
    setLoading(true);
    const options = {
      method: "POST",
      data: {
        domain: domain,
        waiting: waiting || 30,
      },
    };
    try {
      const response = await axios(
        "http://localhost:5050/api/crawl-links",
        options
      );
      const data = await response.data;
      setLinksData(data.linksData);
      console.log(data.linksData);
    } catch (error) {
      console.log(error);
      setLinksData();
      setError(true);
    }
    setLoading(false);
  };

  const resetPage = () => {
    setLinksData();
    // setDomain("");
    setError(false);
  };

  return (
    <div className="app">
      <form className="inputDiv">
        <div>
          <input
            placeholder="Input domain"
            defaultValue={domain}
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          />
          <input
            type="number"
            max="30"
            value={waiting}
            placeholder="Input waiting time in second"
            onChange={(e) => setWaiting(e.target.value)}
          />
        </div>
        <div>
          <button type="submit" onClick={(e) => getLinks(e)}>
            Crawl
          </button>
          <button onClick={resetPage}>Reset Page</button>
        </div>
      </form>
      {loading && <div>Loading...</div>}
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
                <p className="cell">{item.id}</p>
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
