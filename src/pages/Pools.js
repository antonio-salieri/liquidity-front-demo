import CreatePoolModal from "../components/modal/CreatePoolModal";
import CoinImgShower from "../elements/CoinImageShower";
import { Component } from "react";
import {
	Wrapper,
	SectionHead,
	TableHeader,
	Row,
	PoolTable,
	GoCreatePool
} from "../design/pages/Pools";

class Pools extends Component {
	constructor(props) {
		super(props);
		this.state = {
			poolsData: this.props.data.poolsData,
			isModal: false,
			isLoading: false
		};
	}

	componentDidMount() {
		if (this.props.data.poolsData !== null) {
			this.setState({ poolsData: this.props.data.poolsData, isLoading: true });
		}
	}

	componentDidUpdate(prevProps) {
		if (prevProps.data.poolsData !== this.props.data.poolsData) {
			this.setState({ poolsData: this.props.data.poolsData, isLoading: true });
		}
	}

	modalHandler = () => {
		this.setState({ isModal: !this.state.isModal });
	};

	getPoolPairs(item) {
		return [
			item.liquidity_pool.reserve_coin_denoms[0].substr(1).toUpperCase(),
			item.liquidity_pool.reserve_coin_denoms[1].substr(1).toUpperCase()
		];
	}

	getSecondPairPrice(item) {
		const price =
			Number(item.liquidity_pool_metadata.reserve_coins[1]?.amount) /
			Number(item.liquidity_pool_metadata.reserve_coins[0]?.amount);
		return Number(price).toFixed(2);
	}

	createRows(data) {
		if (!this.state.isLoading) {
			return <div></div>;
		}
		if (data === null || data === undefined || data.length === 0) {
			return (
				<div
					style={{ color: "#a5a6a9", lineHeight: 1.5, marginBottom: "27px" }}
				>
					There are no pools created yet.
					<br />
					Be the first to create a pool!
				</div>
			);
		} else {
			return data.map((item, index) => {
				const pairs = this.getPoolPairs(item);
				const secondPairPrice = this.getSecondPairPrice(item);
				return (
					isNaN(secondPairPrice) ?
						'' : <Row key={index}>
							<div>
								<CoinImgShower coin={pairs[0]} />
								{pairs[0]}
								<span>···</span>
								<CoinImgShower coin={pairs[1]} />
								{pairs[1]}
							</div>
							<div>
								{`1 ${pairs[0]} per`}
								<br />
								{`${secondPairPrice} ${pairs[1]}`}
							</div>
						</Row>
				);
			});
		}
	}

	render() {
		return (
			<Wrapper>
				<SectionHead>
					<div>Pools</div>
					<GoCreatePool onClick={this.modalHandler}>Create Pool</GoCreatePool>
				</SectionHead>
				<PoolTable>
					<TableHeader>
						<div>Pool</div>
						<div>Price</div>
					</TableHeader>
					{this.createRows(this.state.poolsData)}
				</PoolTable>
				{this.state.isModal ? (
					<CreatePoolModal modalHandler={this.modalHandler} data={this.props.data} />
				) : (
						""
					)}
			</Wrapper>
		);
	}
}

export default Pools;
