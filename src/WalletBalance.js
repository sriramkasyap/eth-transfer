import { formatEther } from "@ethersproject/units";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { DAI_ABI, DAI_ADDRESS } from "./daiCOnfig";

export default function WalletBalance({
  walletConnected,
  walletBalance,
  setBalance,
  setError,
  setScreen,
}) {
  const [isLoading, setLoading] = useState(true);
  const [message, setMessage] = useState("Login to Parcel");
  const [signedMessage, setSignedMessage] = useState();
  const [AuthObject, setAuthObject] = useState({});

  const [daiBalance, setDaiBalance] = useState(0);

  const generateSignedMessage = async (e) => {
    e.preventDefault();
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = await provider.getSigner();
    let signed = await signer.signMessage(message);

    setSignedMessage(signed);
  };

  const generateAuthObject = async (e) => {
    e.preventDefault();
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = await provider.getSigner();
    let auth_msg = `Allow third party app to access your data on Parcel ${Date.now()}`;
    let signed = await signer.signMessage(auth_msg);

    setAuthObject({
      auth: { walletAddress: walletConnected, auth_msg, signature: signed },
    });
  };
  useEffect(() => {
    const getWalletBalance = async () => {
      try {
        let provider = new ethers.providers.Web3Provider(window.ethereum);
        let accountBalance = await provider.getBalance(walletConnected);
        setBalance(accountBalance);
        setLoading(false);
      } catch (e) {
        console.error(e);
        setError(e);
      }
    };

    const getERC20Balance = async () => {
      try {
        let provider = new ethers.providers.Web3Provider(window.ethereum);
        let erc20 = new ethers.Contract(DAI_ADDRESS, DAI_ABI, provider);
        let balance = await erc20.balanceOf(walletConnected);
        setDaiBalance(balance);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError(error);
      }
    };

    getWalletBalance();
    getERC20Balance();
  }, [walletConnected, setBalance, setError]);

  const refreshBalance = async () => {
    try {
      let provider = new ethers.providers.Web3Provider(window.ethereum);
      let accountBalance = await provider.getBalance(walletConnected);
      setBalance(accountBalance);

      let erc20 = new ethers.Contract(DAI_ADDRESS, DAI_ABI, provider);
      let balance = await erc20.balanceOf(walletConnected);
      setDaiBalance(balance);

      setLoading(false);
    } catch (e) {
      console.error(e);
      setError(e);
    }
  };

  return (
    <>
      <h3 className="text-center">Your Wallet Balance</h3>
      <p>{walletConnected}</p>
      <h1 className="text-center wallet-balance">
        {isLoading ? "Loading.." : <>{formatEther(walletBalance)} ETH</>}
      </h1>

      <h1 className="text-center wallet-balance">
        {isLoading ? "Loading.." : <>{formatEther(daiBalance)} DAI</>}
      </h1>

      <button onClick={refreshBalance}>Refresh Balance</button>
      <br />
      <br />
      <button onClick={() => setScreen("TRANSFER")}>Transfer ETH</button>
      <button onClick={() => setScreen("TRANSFERDAI")}>Transfer DAI</button>
      <button onClick={() => setScreen("TRANSFER_MULTISIG")}>
        Transfer DAI from MultiSig Wallet
      </button>

      <form onSubmit={generateSignedMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Generate Signature</button>
        <p>{signedMessage}</p>
      </form>

      <button onClick={generateAuthObject} type="submit">
        Generate Auth Object
      </button>
      <pre
        style={{
          display: "block",
          border: "1px solid black",
          maxWidth: 600,
          margin: "20px auto",
          padding: "20px",
          backgroundColor: "#ccc",
          lineHeight: 1.5,
          color: "#444",
          textAlign: "left",
          fontSize: 13,
          overflowX: "scroll",
        }}
      >
        <code
          style={{
            maxWidth: "100%",
          }}
        >
          {JSON.stringify(AuthObject, null, 4)}
        </code>
      </pre>
    </>
  );
}
