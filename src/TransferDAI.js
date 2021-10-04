import { parseEther } from "@ethersproject/units";
import { ethers } from "ethers";
import { useState } from "react";
import { DAI_ABI, DAI_ADDRESS } from "./daiCOnfig";

export default function TransferDAI({
  setError,
  setSuccess,
  setScreen,
  walletConnected,
}) {
  const [address, setAddress] = useState("");
  const [transferAmount, setTransferAmt] = useState(0);
  const [transferInProgress, setProgress] = useState(false);

  const startPayment = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setProgress(true);
    try {
      let provider = new ethers.providers.Web3Provider(window.ethereum);
      let signer = provider.getSigner();
      ethers.utils.getAddress(address);
      const erc20_rw = new ethers.Contract(DAI_ADDRESS, DAI_ABI, signer);

      let senderBalance = await erc20_rw.balanceOf(walletConnected);

      if (senderBalance.lt(parseEther(transferAmount))) {
        throw new Error(
          "Sorry, you  don't have enough balance in your wallet to complete this transaction"
        );
      }

      let tx = await erc20_rw.transfer(address, parseEther(transferAmount));

      console.log(tx);
      setSuccess(
        `Transfer Completed successfully.\n Transaction hash: ${tx.hash}`
      );
      setAddress("");
      setTransferAmt(0);
      setProgress(false);
    } catch (error) {
      console.error(error);
      setError(error.message);
      setProgress(false);
    }
  };

  const backToWallet = () => {
    setSuccess("");
    setError("");
    setScreen("WALLET");
  };

  return (
    <>
      <h3 className="text-center">Transfer DAI to another Account</h3>
      <button onClick={backToWallet}>Back to My Wallet</button>
      <form action="" onSubmit={startPayment}>
        <div className="input-wrapper">
          <label htmlFor="">Recepient Address</label>
          <input
            className="form-control"
            type="text"
            placeholder={'Starts with "0x"'}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="input-wrapper">
          <label htmlFor="">DAI to Transfer</label>
          <input
            className="form-control"
            type="text"
            value={transferAmount}
            onChange={(e) => setTransferAmt(e.target.value)}
          />
        </div>

        <div className="input-wrapper">
          {transferInProgress ? (
            <>Transfer in Progress...</>
          ) : (
            <button type="submit">Transfer</button>
          )}
        </div>
      </form>
    </>
  );
}
