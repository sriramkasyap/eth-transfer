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

  const [daiBalance, setDaiBalance] = useState(0);
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
    </>
  );
}
