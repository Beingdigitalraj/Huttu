// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract HuttuProMLM {
    address public owner;
    uint256 public totalUsers;
    
    // 7-Level Commission Percentages (e.g., 10% = 1000 for basis points)
    uint256[7] public levelPercentages = [1000, 500, 300, 200, 100, 50, 50]; 

    struct User {
        bool isRegistered;
        address referrer;
        uint256 totalStaked;
        uint256 totalEarnings;
    }

    mapping(address => User) public users;

    event Registered(address indexed user, address indexed referrer);
    event DepositMade(address indexed user, uint256 amount);
    event CommissionPaid(address indexed referrer, address indexed referral, uint256 amount, uint256 level);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the admin");
        _;
    }

    constructor() {
        owner = msg.sender;
        users[msg.sender].isRegistered = true;
        totalUsers = 1;
    }

    // Register and Deposit into Trading/Staking Pool
    function invest(address _referrer) external payable {
        require(msg.value > 0, "Investment must be greater than 0");
        
        if (!users[msg.sender].isRegistered) {
            require(users[_referrer].isRegistered, "Referrer must be registered");
            users[msg.sender].isRegistered = true;
            users[msg.sender].referrer = _referrer;
            totalUsers++;
            emit Registered(msg.sender, _referrer);
        }

        users[msg.sender].totalStaked += msg.value;
        emit DepositMade(msg.sender, msg.value);

        // Distribute 7-Level MLM Commission Automatically on-chain
        address currentReferrer = users[msg.sender].referrer;
        for (uint256 i = 0; i < 7; i++) {
            if (currentReferrer == address(0)) {
                // If no referrer, commission goes to admin/owner vault safely
                payable(owner).transfer((msg.value * levelPercentages[i]) / 10000);
            } else {
                uint256 commission = (msg.value * levelPercentages[i]) / 10000;
                users[currentReferrer].totalEarnings += commission;
                payable(currentReferrer).transfer(commission); // Direct instant on-chain withdrawal
                emit CommissionPaid(currentReferrer, msg.sender, commission, i + 1);
                currentReferrer = users[currentReferrer].referrer;
            }
        }
    }

    // Owner can safely withdraw contract balance if any leftover
    function withdrawAdminFees() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HuttuStaking {
    mapping(address => uint256) public stakedBalance;
    mapping(address => uint256) public lastStakedTime;
    uint256 public constant rewardRate = 5; // 5% सालाना रिटर्न का उदाहरण

    // टोकन स्टेक करने के लिए
    function stake() external payable {
        require(msg.value > 0, "Amount must be greater than 0");
        stakedBalance[msg.sender] += msg.value;
        lastStakedTime[msg.sender] = block.timestamp;
    }

    // रिवॉर्ड कैलकुलेट करने का फंक्शन
    function calculateReward(address _user) public view returns (uint256) {
        uint256 timeStaked = block.timestamp - lastStakedTime[_user];
        return (stakedBalance[_user] * rewardRate * timeStaked) / (365 days * 100);
    }

    // रिवॉर्ड के साथ पैसा निकालने के लिए
    function withdraw() external {
        uint256 reward = calculateReward(msg.sender);
        uint256 totalAmount = stakedBalance[msg.sender] + reward;
        
        stakedBalance[msg.sender] = 0;
        payable(msg.sender).transfer(totalAmount);
    }
}
