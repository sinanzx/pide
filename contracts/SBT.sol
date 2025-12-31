// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SBT - Soulbound Token for PIDE Protocol
 * @notice Custom non-transferable token implementation for verified data insights
 * @dev This is NOT a standard ERC-721. Tokens are bound to addresses and cannot be transferred.
 */
contract SBT {
    // Token metadata structure
    struct TokenData {
        uint256 tokenId;
        address owner;
        string dataHash; // IPFS hash or data identifier
        string proofHash; // zkTLS proof hash
        uint256 timestamp;
        bool verified;
    }

    // State variables
    uint256 private _tokenIdCounter;
    mapping(uint256 => TokenData) private _tokens;
    mapping(address => uint256[]) private _ownerTokens;
    mapping(string => bool) private _usedDataHashes;

    // Events
    event TokenMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string dataHash,
        string proofHash,
        uint256 timestamp
    );
    
    event TokenVerified(uint256 indexed tokenId, uint256 timestamp);
    
    event TokenRevoked(uint256 indexed tokenId, uint256 timestamp);

    // Errors
    error TransferNotAllowed();
    error TokenDoesNotExist();
    error NotTokenOwner();
    error DataAlreadyUsed();
    error AlreadyVerified();

    /**
     * @notice Mint a new Soulbound Token
     * @param dataHash The hash of the verified data
     * @param proofHash The zkTLS proof hash
     * @return tokenId The ID of the newly minted token
     */
    function mint(
        string memory dataHash,
        string memory proofHash
    ) external returns (uint256) {
        if (_usedDataHashes[dataHash]) revert DataAlreadyUsed();

        uint256 tokenId = _tokenIdCounter++;
        
        _tokens[tokenId] = TokenData({
            tokenId: tokenId,
            owner: msg.sender,
            dataHash: dataHash,
            proofHash: proofHash,
            timestamp: block.timestamp,
            verified: false
        });

        _ownerTokens[msg.sender].push(tokenId);
        _usedDataHashes[dataHash] = true;

        emit TokenMinted(tokenId, msg.sender, dataHash, proofHash, block.timestamp);

        return tokenId;
    }

    /**
     * @notice Verify a token (admin/oracle function)
     * @param tokenId The token to verify
     */
    function verify(uint256 tokenId) external {
        if (_tokens[tokenId].owner == address(0)) revert TokenDoesNotExist();
        if (_tokens[tokenId].verified) revert AlreadyVerified();

        _tokens[tokenId].verified = true;

        emit TokenVerified(tokenId, block.timestamp);
    }

    /**
     * @notice Revoke a token (only owner can revoke their own token)
     * @param tokenId The token to revoke
     */
    function revoke(uint256 tokenId) external {
        if (_tokens[tokenId].owner == address(0)) revert TokenDoesNotExist();
        if (_tokens[tokenId].owner != msg.sender) revert NotTokenOwner();

        delete _tokens[tokenId];

        emit TokenRevoked(tokenId, block.timestamp);
    }

    /**
     * @notice Get token data
     * @param tokenId The token ID to query
     * @return TokenData struct
     */
    function getToken(uint256 tokenId) external view returns (TokenData memory) {
        if (_tokens[tokenId].owner == address(0)) revert TokenDoesNotExist();
        return _tokens[tokenId];
    }

    /**
     * @notice Get all tokens owned by an address
     * @param owner The address to query
     * @return Array of token IDs
     */
    function getTokensByOwner(address owner) external view returns (uint256[] memory) {
        return _ownerTokens[owner];
    }

    /**
     * @notice Get total supply of tokens
     * @return Total number of tokens minted
     */
    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter;
    }

    /**
     * @notice Check if a data hash has been used
     * @param dataHash The hash to check
     * @return bool indicating if hash is used
     */
    function isDataHashUsed(string memory dataHash) external view returns (bool) {
        return _usedDataHashes[dataHash];
    }

    /**
     * @dev Prevent any transfer attempts
     */
    function transfer(address, uint256) external pure {
        revert TransferNotAllowed();
    }

    /**
     * @dev Prevent any transfer attempts
     */
    function transferFrom(address, address, uint256) external pure {
        revert TransferNotAllowed();
    }
}
