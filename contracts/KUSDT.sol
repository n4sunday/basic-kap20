// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./abstracts/Blacklist.sol";
import "./interfaces/IKToken.sol";
import "./token/KAP20.sol";
import "./interfaces/IKAP20.sol";
import "./abstracts/KYCHandler.sol";
import "./abstracts/Pauseable.sol";

contract KUSDT is KAP20, IKToken {
    constructor(
        address admin,
        address committee,
        IKYCBitkubChain kyc,
        uint256 acceptedKycLevel
    )
        KAP20(
            "Bitkub-Peg USDT",
            "KUSDT",
            18,
            admin,
            committee,
            kyc,
            acceptedKycLevel
        )
    {}

    function internalTransfer(
        address sender,
        address recipient,
        uint256 amount
    ) external override whenNotPaused onlyAdmin returns (bool) {
        require(
            kyc.kycsLevel(sender) >= acceptedKycLevel &&
                kyc.kycsLevel(recipient) >= acceptedKycLevel,
            "Only internal purpose"
        );

        _transfer(sender, recipient, amount);
        return true;
    }

    function externalTransfer(
        address sender,
        address recipient,
        uint256 amount
    ) external override whenNotPaused onlyAdmin returns (bool) {
        require(
            kyc.kycsLevel(sender) >= acceptedKycLevel,
            "Only internal purpose"
        );

        _transfer(sender, recipient, amount);
        return true;
    }

    function mint(address account, uint256 amount)
        external
        virtual
        onlyCommittee
        returns (bool)
    {
        _mint(account, amount);
        return true;
    }

    function burn(address account, uint256 amount)
        external
        virtual
        onlyCommittee
        returns (bool)
    {
        _burn(account, amount);
        return true;
    }
}
