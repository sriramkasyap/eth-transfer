import { formatEther } from "@ethersproject/units";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

export default function WalletBalance({
  walletConnected,
  walletBalance,
  setBalance,
  setError,
  setScreen,
}) {
  const [isLoading, setLoading] = useState(true);
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

    getWalletBalance();
  }, [walletConnected, setBalance, setError]);

  const refreshBalance = async () => {
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

  const goToSendScreen = (e) => {
    setScreen("TRANSFER");
  };

  return (
    <>
      <h3 className="text-center">Your Wallet Balance</h3>
      <h1 className="text-center wallet-balance">
        {isLoading ? "Loading.." : <>{formatEther(walletBalance)} ETH</>}
      </h1>

      <button onClick={refreshBalance}>Refresh Balance</button>
      <br />
      <br />
      <button onClick={goToSendScreen}>Transfer ETH</button>
    </>
  );
}
