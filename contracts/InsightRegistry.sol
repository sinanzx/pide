// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title InsightRegistry
 * @notice Soulbound token registry for verified data insights
 * @dev Non-transferable NFTs minted only by authorized verifiers
 */
contract InsightRegistry is ERC721, AccessControl {
    using Strings for uint256;

    // Role definition
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    // Token counter
    uint256 private _tokenIdCounter;

    // Badge type enumeration
    enum BadgeType {
        STEAM,      // Type 0
        BANK,       // Type 1
        GITHUB,     // Type 2
        LINKEDIN,   // Type 3
        CUSTOM      // Type 4+
    }

    // Mapping from token ID to badge type
    mapping(uint256 => BadgeType) private _badgeTypes;

    // Mapping from token ID to custom metadata URI (for CUSTOM type)
    mapping(uint256 => string) private _customURIs;

    // Base URI for metadata
    string private _baseTokenURI;

    // Events
    event LogProofVerified(address indexed user, uint256 indexed badgeId, BadgeType badgeType);
    event BaseURIUpdated(string newBaseURI);

    /**
     * @dev Constructor sets up roles and initial configuration
     * @param admin Address that will have admin role
     * @param verifier Address that will have verifier role
     * @param baseURI Base URI for token metadata
     */
    constructor(
        address admin,
        address verifier,
        string memory baseURI
    ) ERC721("PIDE Insight Badge", "PIDE") {
        require(admin != address(0), "Admin cannot be zero address");
        require(verifier != address(0), "Verifier cannot be zero address");

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(VERIFIER_ROLE, verifier);
        _baseTokenURI = baseURI;

        emit BaseURIUpdated(baseURI);
    }

    /**
     * @dev Mint a new soulbound token
     * @param to Address to mint the token to
     * @param badgeType Type of badge being minted
     * @return tokenId The ID of the newly minted token
     */
    function mint(address to, BadgeType badgeType) 
        external 
        onlyRole(VERIFIER_ROLE) 
        returns (uint256) 
    {
        require(to != address(0), "Cannot mint to zero address");
        
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        _safeMint(to, tokenId);
        _badgeTypes[tokenId] = badgeType;

        emit LogProofVerified(to, tokenId, badgeType);

        return tokenId;
    }

    /**
     * @dev Mint a custom badge with specific metadata URI
     * @param to Address to mint the token to
     * @param customURI Custom metadata URI for this token
     * @return tokenId The ID of the newly minted token
     */
    function mintCustom(address to, string memory customURI) 
        external 
        onlyRole(VERIFIER_ROLE) 
        returns (uint256) 
    {
        require(to != address(0), "Cannot mint to zero address");
        require(bytes(customURI).length > 0, "Custom URI cannot be empty");
        
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        _safeMint(to, tokenId);
        _badgeTypes[tokenId] = BadgeType.CUSTOM;
        _customURIs[tokenId] = customURI;

        emit LogProofVerified(to, tokenId, BadgeType.CUSTOM);

        return tokenId;
    }

    /**
     * @dev Returns the badge type for a given token
     * @param tokenId Token ID to query
     * @return BadgeType of the token
     */
    function getBadgeType(uint256 tokenId) external view returns (BadgeType) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return _badgeTypes[tokenId];
    }

    /**
     * @dev Returns the token URI with dynamic metadata based on badge type
     * @param tokenId Token ID to query
     * @return Token metadata URI
     */
    function tokenURI(uint256 tokenId) 
        public 
        view 
        override 
        returns (string memory) 
    {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");

        BadgeType badgeType = _badgeTypes[tokenId];

        // Return custom URI if set
        if (badgeType == BadgeType.CUSTOM) {
            return _customURIs[tokenId];
        }

        // Construct URI based on badge type
        string memory baseURI = _baseURI();
        string memory badgeTypeName = _getBadgeTypeName(badgeType);
        
        return string(
            abi.encodePacked(
                baseURI,
                badgeTypeName,
                "/",
                tokenId.toString(),
                ".json"
            )
        );
    }

    /**
     * @dev Update base URI (admin only)
     * @param newBaseURI New base URI
     */
    function setBaseURI(string memory newBaseURI) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        _baseTokenURI = newBaseURI;
        emit BaseURIUpdated(newBaseURI);
    }

    /**
     * @dev Override to prevent transfers (soulbound)
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);
        
        // Allow minting (from == address(0))
        // Block all transfers (from != address(0) && to != address(0))
        // Allow burning (to == address(0))
        require(
            from == address(0) || to == address(0),
            "Soulbound: token is non-transferable"
        );

        return super._update(to, tokenId, auth);
    }

    /**
     * @dev Internal function to get base URI
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    /**
     * @dev Internal helper to convert badge type to string
     */
    function _getBadgeTypeName(BadgeType badgeType) 
        internal 
        pure 
        returns (string memory) 
    {
        if (badgeType == BadgeType.STEAM) return "steam";
        if (badgeType == BadgeType.BANK) return "bank";
        if (badgeType == BadgeType.GITHUB) return "github";
        if (badgeType == BadgeType.LINKEDIN) return "linkedin";
        return "custom";
    }

    /**
     * @dev See {IERC165-supportsInterface}
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @dev Returns total number of tokens minted
     */
    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter;
    }
}
