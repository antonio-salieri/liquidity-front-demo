
import { Component } from "react";
import { DepositButton, TableHeader, PoolTable, Row } from "../design/components/PoolList"
import CoinImgShower from "../elements/CoinImageShower"

class PoolList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			poolsData: null,
			updatePool: null
		};
	}

	componentDidMount() {
		if (this.props.poolsData !== null) {
			this.setState({ poolsData: this.props.poolsData })
		}
	}

	componentDidUpdate(prevProps) {
		if (prevProps.poolsData !== this.props.poolsData) {
			this.setState({ poolsData: this.props.poolsData })
		}
	}

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

	selectPool = (pool) => {
		this.props.selectPool(pool);
	};

	createRows = (data) => {
		if (data === null || data === undefined || data.length === 0) {
			return (
				<div
					style={{ color: "#ea5353", fontSize: "18px", fontWeight: "bold" }}
				>There are no pools to display yet.<br />
			Be the first to create a pool!
				</div>
			);
		} else {
			return data.map((item, index) => {
				const pairs = this.getPoolPairs(item);
				const secondPairPrice = this.getSecondPairPrice(item);
				return (
					<Row key={index}>
						<div><CoinImgShower coin={pairs[0]} />{pairs[0]} - <CoinImgShower coin={pairs[1]} />{pairs[1]}</div>
						<div>
							{`1 ${pairs[0]} per`}
							<br />
							{`${secondPairPrice} ${pairs[1]}`}
						</div>
						<div>
							<DepositButton
								onClick={() => {
									this.selectPool(item);
								}}
							>
								{this.props.actionName ? this.props.actionName : "Select"}
							</DepositButton>
						</div>
					</Row>
				);
			});
		}
	};

	render() {
		return (
			<>
				<PoolTable>
					<TableHeader>
						<div>Pool</div>
						<div>Price</div>
						<div>Action</div>
					</TableHeader>
					{this.createRows(this.state.poolsData)}
				</PoolTable>
			</>
		);
	}
}

export default PoolList;
