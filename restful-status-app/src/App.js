import moment from "moment-timezone";
import { useEffect, useState } from "react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
function App() {
  let [healthchecks, setHealthchecks] = useState([]);
  let [lastFetch, setLastFetch] = useState("never");
  let [accessToken, setAccessToken] = useState("");
  let [success,setSuccess] = useState(false);

  async function refresh() {
    let response = await fetch('/api/v1/healthcheck/status',{
      headers: {
        authorization: `${accessToken}`
      }
    });
    let json = await response.json();
    if(response.status==200) setSuccess(true);
    // setSuccess(true);
    setHealthchecks(json);
  }

  useEffect(() => {
    const interval = setInterval(refresh, 1000);
    setLastFetch(moment().fromNow());
    refresh();
    return () => clearInterval(interval);
  }, [accessToken])


  if (!success) return (
    <div className="flex flex-col w-full max-w-sm mx-auto text-center space-y-6 mt-10 border rounded-xl p-4">
      <label className="text-xl font-bold">Access Token</label>
      <input onChange={({target})=>setAccessToken(target.value)} placeholder="access token" className="border-b focus:outline-0 text-center text-2xl" type="password" autoFocus />
      <button className="bg-gray-200 rounder-sm px-2">authenticate</button>
    </div>
  )

  return (
    <div className="App">
      <div className="mx-auto w-full max-w-md mt-10 p-4 border border-gray-300 rounded-lg">
        <div className="text-2xl border-b">
          RESTful Status <button className="text-sm border" onClick={refresh}>refresh</button>
        </div>
        <div className="text-sm italic">last update was {lastFetch}</div>
        <div className="mt-4">
          <table className="table-fixed w-full text-left">
            <thead>
              <tr className="text-white bg-gray-700">
                <th>Health Check</th>
                <th className="w-24 text-center">Status</th>
              </tr>
              {[...new Set(healthchecks.map(hc => hc.category))].map(category => (
                <>
                  <tr className="bg-gray-300">
                    <td colspan={2}>{category}</td>
                  </tr>
                  {healthchecks.filter(hc => hc.category === category).map(check => (
                    <tr>
                      <td>{check.check} <span className="text-sm italic">({moment(check.lastUpdate).fromNow()})</span></td>
                      <td className={classNames(
                        check.health < 100 ? "bg-red-600" : "bg-green-600",
                        "text-center")}></td>
                    </tr>
                  ))}
                </>
              ))}
            </thead>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
