import { ethers } from "ethers";
import { useEffect } from "react";

export default function ConnectWallet({
  setError,
  setScreen,
  walletConnected,
  setWallet,
}) {
  useEffect(() => {
    if (!window.ethereum) {
      return setError("Couldn't find any wallet. Please install Metamask.");
    }
    const checkIfAlreadyConnected = async () => {
      let provider = new ethers.providers.Web3Provider(window.ethereum);
      let accounts = await provider.listAccounts();
      if (accounts.length > 0) {
        setWallet((await provider.send("eth_requestAccounts"))[0]);
        setScreen("WALLET");
      }
    };
    checkIfAlreadyConnected();
  }, [setError, setScreen, setWallet]);

  const connectUserWallet = async () => {
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    setWallet((await provider.send("eth_requestAccounts"))[0]);
    setScreen("WALLET");
  };

  return (
    <>
      {window.ethereum && !walletConnected ? (
        <button onClick={connectUserWallet}>Connect your Wallet</button>
      ) : (
        <></>
      )}
    </>
  );
}
