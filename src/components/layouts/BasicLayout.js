import { Component } from "react";
import { NavLink } from "react-router-dom";
import {
	Layout,
	HeaderPlaceholder,
	Header,
	Brand,
	Connect
} from "../../design/components/layouts/BasicLayout";
import Wallet from "../Wallet"
import { GaiaApi } from "@chainapsis/cosmosjs/gaia/api";
import { chainInfo } from "../../common/config";
import Axios from "axios";

class BasicLayout extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activeStyle: {
				backgroundColor: "#ffaa0d"
			},
			isSent: false,
			isWallet: false,
		};
	}

	componentDidMount() {
		window.onload = () => {
			this.connectWallet();
		};
	}

	connectWallet = async (isClick) => {
		if (!window.cosmosJSWalletProvider) {
			alert("Please install the Keplr extension");
			return;
		}

		if (!window.keplr?.experimentalSuggestChain) {
			alert("Please use the latest version of Keplr extension");
			return;
		}

		await window.keplr.experimentalSuggestChain(chainInfo);

		const cosmosJS = new GaiaApi({
			chainId: chainInfo.chainId,
			rpc: chainInfo.rpc,
			rest: chainInfo.rest,
			walletProvider: window.cosmosJSWalletProvider
		});

		await cosmosJS.enable();

		const keys = await cosmosJS.getKeys();

		if (keys.length === 0) {
			throw new Error("there is no key");
		}
		this.bech32Address = keys[0].bech32Address;

		localStorage.setItem("walletAddress", this.bech32Address);

		this.setState({
			cosmosJS,
			address: this.bech32Address
		});

		if (isClick) {
			this.modalHandler()
		}

	};

	getModifiedAddress = (address) => {
		return `${address.substr(0, 10)}...${address.substr(-5)}`;
	};

	sendFaucetRequest = async () => {
		try {
			alert("send a request! it takes about 10 seconds :)");
			this.setState({ isSent: true });
			const response = await Axios.get(
				`https://dev.bharvest.io/faucet/?address=${localStorage.getItem(
					"walletAddress"
				)}`
			);
			alert(response.data);
			this.setState({ isSent: false });
			console.log("Faucet response", response);
		} catch (error) {
			alert(error.data);
			this.setState({ isSent: false });
			console.log(error);
		}
	};

	modalHandler = () => {
		this.setState({
			isWallet: !this.state.isWallet
		})
	}

	render() {
		return (
			<Layout>
				<HeaderPlaceholder />
				<Header>
					<Brand>
						<img src="/assets/bh-logo.png" alt="seems to be missing" />
						<img src="/assets/amm-demo.svg" alt="seems to be missing" />
					</Brand>
					<NavLink exact to={"/"} activeStyle={this.state.activeStyle}>
						Pools
					</NavLink>
					<NavLink exact to={"/swap"} activeStyle={this.state.activeStyle}>
						Swap
					</NavLink>
					<NavLink exact to={"/deposit"} activeStyle={this.state.activeStyle}>
						Deposit
					</NavLink>
					<NavLink exact to={"/withdraw"} activeStyle={this.state.activeStyle}>
						Withdraw
					</NavLink>
					<span
						onClick={this.sendFaucetRequest}
						style={
							this.state.isSent
								? { color: "#a7a7a7", pointerEvents: "none" }
								: {}
						}
					>
						{this.state.isSent ? "Waiting... 💸" : "Faucet 💸"}
					</span>
					<Connect onClick={this.connectWallet}>
						{this.state.address
							? `${this.getModifiedAddress(this.state.address)}`
							: "CONNECT WALLET"}
					</Connect>
					{this.state.isWallet ? <Wallet data={this.props.data} modalHandler={this.modalHandler} /> : ''}
				</Header>

				{this.props.children}
			</Layout>
		);
	}
}

export default BasicLayout;
