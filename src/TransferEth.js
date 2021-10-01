import { useState } from "react";

export default function TransferEth({ setError, setScreen }) {
  const [address, setAddress] = useState("");
  const [transferAmount, setTransferAmt] = useState(0);
  return (
    <>
      <h3 className="text-center">Transfer ETH to another Account</h3>

      <form action="">
        <div className="input-wrapper">
          <input
            className="form-control"
            type="text"
            placeholder={'Recepient Ethereum Address. Starts with "0x"'}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="input-wrapper">
          <input
            className="form-control"
            type="text"
            value={transferAmount}
            onChange={(e) => setTransferAmt(e.target.value)}
          />
        </div>
      </form>
    </>
  );
}
