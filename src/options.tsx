import React from "react";
import { createRoot } from "react-dom/client";
import "./styles/globals.css";
import axios from "axios";

const Options = () => {
  const [redactAPIKey, setRedactAPIKey] = React.useState("");
  const [pangeaDomain, setPangeaDomain] = React.useState("");
  const [message, setMessage] = React.useState(" ");

  React.useEffect(() => {
    chrome.storage.sync.get(
      {
        apiKey: "default",
        pangeaDomain: "default",
      },
      (items) => {
        if (items.apiKey != "default") {
          setRedactAPIKey("*******************");
        }

        if (items.pangeaDomain != "default") {
          setPangeaDomain(items.pangeaDomain);
        }
      }
    );
  }, []);

  const setKey = async () => {
    if (redactAPIKey.length < 5 || pangeaDomain.length < 5) {
      setMessage("Please Fill Correctly");

      const id = setTimeout(() => {
        setMessage("");
      }, 1000);
      return clearTimeout(id);
    }

    try {
      setMessage("Checking Keys");

      await axios.post(
        `https://redact.${pangeaDomain}/v1/redact`,
        {
          text: "0",
        },
        {
          headers: {
            Authorization: `Bearer ${redactAPIKey}`,
          },
        }
      );
    } catch (error) {
      setMessage("Error Occurred. Please recheck the keys");

      const id = setTimeout(() => {
        setMessage("");
      }, 1000);
      return clearTimeout(id);
    }

    chrome.storage.sync.set(
      {
        apiKey: redactAPIKey,
        pangeaDomain: pangeaDomain,
      },
      () => {
        setMessage("API Key Saved");

        const id = setTimeout(() => {
          setMessage("");
        }, 1000);
        clearTimeout(id);
      }
    );
  };

  return (
    <div className="flex flex-col justify-center px-5 h-screen text-lg">
      <p className="mb-2 text-sm text-gray-500">Pangea Redact API Key</p>
      <input
        type="text"
        placeholder="Enter Your Pangea Redact API Key"
        className="rounded-md w-full border-gray-300 border mb-3 py-2 px-3 focus:outline-none focus:ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-50 text-base"
        value={redactAPIKey}
        onChange={(e) => {
          setRedactAPIKey(e.target.value);
        }}
      />

      <p className="mb-2 text-sm text-gray-500 mt-2">Pangea Domain</p>
      <input
        type="text"
        placeholder="Enter Your Pangea Domain"
        className="rounded-md w-full border-gray-300 border mb-5 py-2 px-3 focus:outline-none focus:ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-50 text-base"
        value={pangeaDomain}
        onChange={(e) => {
          setPangeaDomain(e.target.value);
        }}
      />
      <button
        className="w-full bg-blue-500 rounded-md text-white py-2 focus:ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-50"
        onClick={setKey}
      >
        Save
      </button>

      <p className="mt-5 text-gray-500 text-sm text-center">{message}</p>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>
);
