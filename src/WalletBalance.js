import { formatEther } from "@ethersproject/units";
import { ethers } from "ethers";
import { useEffect } from "react";

export default function WalletBalance({
  walletConnected,
  walletBalance,
  setBalance,
  setError,
  setScreen,
}) {
  useEffect(() => {
    const getWalletBalance = async () => {
      try {
        let provider = new ethers.providers.Web3Provider(window.ethereum);
        let accountBalance = await provider.getBalance(walletConnected);
        console.log(accountBalance);
        setBalance(accountBalance);
      } catch (e) {
        console.error(e);
        setError(e);
      }
    };

    getWalletBalance();
  }, [walletConnected, setBalance, setError]);

  const goToSendScreen = (e) => {
    setScreen("TRANSFER");
  };

  return (
    <>
      <h3 className="text-center">Your Wallet Balance</h3>
      <h1 className="text-center wallet-balance">
        {formatEther(walletBalance)} ETH
      </h1>

      <button onClick={goToSendScreen}>Transfer ETH</button>
    </>
  );
}
