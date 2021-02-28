//For the wallet connect button

export const connectWallet = async () => {
	if (window.ethereum) {
		try {
			const addressArray = await window.ethereum.request({
				method: "eth_requestAccounts",
			});
			const obj = {
				status: "👆🏽 Write a message in the text-field above.",
				address: addressArray[0],
			};
			return obj;
		} catch (err) {
			return { address: "", status: "😥 " + err.message };
		}
	} else {
		return {
			address: "",
			status: (
				<span>
					{" "}
					<p>
						{" "}
						🦊{" "}
						<a
							rel="noreferrer" 
							target="_blank"
							href={`https://metamask.io/download.html`}
						>
							{" "}
							You must install Metamask, a virtual Ethereum
							wallet, in your browser.{" "}
						</a>{" "}
					</p>{" "}
				</span>
			),
		};
	}
};

export default connectWallet;