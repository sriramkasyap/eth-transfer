import { parseEther } from "@ethersproject/units";
import { ethers } from "ethers";
import { useState } from "react";

export default function TransferEth({ setError, setSuccess, setScreen }) {
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
      let tx = await signer.sendTransaction({
        to: address,
        value: parseEther(transferAmount),
      });

      console.log(tx);
      setSuccess(
        `Tramsaction Completed successfully. Transaction hash: ${tx.hash}`
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
      <h3 className="text-center">Transfer ETH to another Account</h3>
      <button onClick={backToWallet}>Back to My Wallet</button>
      <form action="" onSubmit={startPayment}>
        <div className="input-wrapper">
          <label htmlFor="">Recepient Ethereum Address</label>
          <input
            className="form-control"
            type="text"
            placeholder={'Starts with "0x"'}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="input-wrapper">
          <label htmlFor="">ETH to Transfer</label>
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
