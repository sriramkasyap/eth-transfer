import { parseEther } from "@ethersproject/units";
import { ethers } from "ethers";
import { useState } from "react";
import { DAI_ABI, DAI_ADDRESS } from "./daiCOnfig";
import { MULTISIG_ABI } from "./multiSigConfig";
import { EthersAdapter } from "contract-proxy-kit";

export default function TransferMultiSig({
  setError,
  setSuccess,
  setScreen,
  walletConnected,
}) {
  const [address, setAddress] = useState(); //Recipient Address
  const [multiSigAddress, setMultiSigAddress] = useState(); // Sender's MultiSig Wallet Adderss
  const [transferAmount, setTransferAmt] = useState(0); // DAI Amount to transfer
  const [transferInProgress, setProgress] = useState(false);

  const startPayment = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setProgress(true);
    try {
      let provider = new ethers.providers.Web3Provider(window.ethereum);
      let gnosis_contract = new ethers.Contract(
        multiSigAddress,
        MULTISIG_ABI,
        provider.getSigner()
      );

      let erc20_contract = new ethers.Contract(DAI_ADDRESS, DAI_ABI, provider);

      const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

      // setup signatures from the current metamask account
      const ethLibAdapter = new EthersAdapter({
        ethers,
        signer: provider.getSigner(walletConnected),
      });
      const autoApprovedSignature = ethLibAdapter.abiEncodePacked(
        { type: "uint256", value: walletConnected }, // r
        { type: "uint256", value: 0 }, // s
        { type: "uint8", value: 1 } // v
      );

      //Args to execTransaction
      const to = DAI_ADDRESS; // Address of the Token's (DAI) contract
      const value = 0; // only for ETH
      const data = erc20_contract.interface.encodeFunctionData("transfer", [
        address,
        parseEther(transferAmount),
      ]); // generate the encoded data
      const operation = 0; // CALL
      const safeTxGas = 0; // If 0, then no refund to relayer
      const baseGas = 0;
      const gasPrice = 0;
      const gasToken = ZERO_ADDRESS;
      const refundReceiver = ZERO_ADDRESS;
      const signature = autoApprovedSignature;

      const tx = await gnosis_contract.execTransaction(
        to,
        value,
        data,
        operation,
        safeTxGas,
        baseGas,
        gasPrice,
        gasToken,
        refundReceiver,
        signature
      );

      console.log(tx);

      setSuccess(
        `Transfer Completed successfully.\n Transaction hash: ${tx.hash}`
      );
      setMultiSigAddress("");
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
      <h3 className="text-center">Transfer DAI to a Multi-Sig Account</h3>
      <button onClick={backToWallet}>Back to My Wallet</button>
      <form action="" onSubmit={startPayment}>
        <div className="input-wrapper">
          <label htmlFor="">MultiSig Wallet Address</label>
          <input
            className="form-control"
            type="text"
            placeholder={'Starts with "0x"'}
            value={address}
            onChange={(e) => setMultiSigAddress(e.target.value)}
          />
        </div>
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
