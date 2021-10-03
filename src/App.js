import { useState } from "react";
import "./App.css";
import ConnectWallet from "./ConnectWallet";
import TransferDAI from "./TransferDAI";
import TransferEth from "./TransferEth";
import WalletBalance from "./WalletBalance";

function App() {
  const [errorMessage, setError] = useState("");
  const [successMessage, setSuccess] = useState("");
  const [walletConnected, setWallet] = useState(false);
  const [walletBalance, setBalance] = useState(0);
  const [currentScreen, setScreen] = useState("CONNECT");
  // CONNECT, WALLET, TRANSFER, SUCCESS

  return (
    <div className="App">
      <h1 className="text-center main-heading">Token Transfer App</h1>
      {currentScreen === "CONNECT" ? (
        <ConnectWallet
          setError={setError}
          setScreen={setScreen}
          setWallet={setWallet}
          walletConnected={walletConnected}
        />
      ) : currentScreen === "WALLET" ? (
        <WalletBalance
          walletBalance={walletBalance}
          walletConnected={walletConnected}
          setBalance={setBalance}
          setError={setError}
          setScreen={setScreen}
        />
      ) : currentScreen === "TRANSFER" ? (
        <TransferEth
          setError={setError}
          setScreen={setScreen}
          setSuccess={setSuccess}
        />
      ) : currentScreen === "TRANSFERDAI" ? (
        <TransferDAI
          setError={setError}
          setScreen={setScreen}
          setSuccess={setSuccess}
          walletConnected={walletConnected}
        />
      ) : currentScreen === "SUCCESS" ? (
        <TransferSuccess />
      ) : (
        <></>
      )}

      <p className="text-center error-message">{errorMessage}</p>
      <p className="text-center success-message">{successMessage}</p>
    </div>
  );
}

export default App;

const TransferSuccess = () => <></>;
