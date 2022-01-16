// SPDX-License-Identifier: MIT

// File: contracts/interfaces/IAdmin.sol

pragma solidity ^0.8.0;

// File: contracts/interfaces/IKAP20.sol

pragma solidity ^0.8.0;

interface IKAP20 {
    event Transfer(address indexed from, address indexed to, uint256 tokens);
    event Approval(
        address indexed tokenOwner,
        address indexed spender,
        uint256 tokens
    );

    function balanceOf(address tokenOwner)
        external
        view
        returns (uint256 balance);

    function allowance(address tokenOwner, address spender)
        external
        view
        returns (uint256 remaining);

    function transfer(address to, uint256 tokens)
        external
        returns (bool success);

    function approve(address spender, uint256 tokens)
        external
        returns (bool success);

    function transferFrom(
        address from,
        address to,
        uint256 tokens
    ) external returns (bool success);

    function getOwner() external view returns (address);

    function mint(address _toAddr, uint256 _amount)
        external
        returns (bool success);

    function burn(address _fromAddr, uint256 _amount)
        external
        returns (bool success);
}

// File: contracts/PubgPowerToken.sol

pragma solidity ^0.8.0;

contract SundayToken is IKAP20 {
    string public name = "Sunday Token";
    string public symbol = "SDT";
    uint256 public decimals = 18;

    uint256 public totalSupply;

    address public admin;

    mapping(address => uint256) public balance;
    mapping(address => mapping(address => uint256)) public allowed;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Restricted only super admin");
        _;
    }

    function getOwner() external view override returns (address) {
        return address(admin);
    }

    constructor(address _admin) public {
        admin = _admin;
    }

    function setNewAdmin(address _admin) external onlyAdmin {
        admin = _admin;
    }

    function mint(address _toAddr, uint256 _amount)
        external
        override
        onlyAdmin
        returns (bool)
    {
        balance[_toAddr] += _amount;
        totalSupply += _amount;
        emit Transfer(address(0), _toAddr, _amount);
        return true;
    }

    function burn(address _fromAddr, uint256 _amount)
        external
        override
        returns (bool)
    {
        require(balance[_fromAddr] >= _amount);
        balance[_fromAddr] -= _amount;
        emit Transfer(_fromAddr, address(0), _amount);
        return true;
    }

    function balanceOf(address _walletAddress)
        public
        view
        override
        returns (uint256)
    {
        return balance[_walletAddress];
    }

    function allowance(address _owner, address _spender)
        public
        view
        override
        returns (uint256)
    {
        return allowed[_owner][_spender];
    }

    function transfer(address _to, uint256 _value)
        public
        override
        returns (bool)
    {
        require(_value <= balance[msg.sender], "Insufficient Balance");

        balance[msg.sender] -= _value;
        balance[_to] += _value;
        emit Transfer(msg.sender, _to, _value);

        return true;
    }

    function approve(address _spender, uint256 _value)
        public
        override
        returns (bool)
    {
        allowed[msg.sender][_spender] = _value;

        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public override returns (bool) {
        require(_value <= balance[_from]);
        require(_value <= allowed[_from][msg.sender]);
        require(_to != address(0));

        balance[_from] -= (_value);
        balance[_to] += _value;
        allowed[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }
}
