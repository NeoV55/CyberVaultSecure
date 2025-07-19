# IOTA CyberVault Integration Setup Guide

This guide explains how to integrate the CyberVault web interface with your local IOTA CLI for blockchain operations.

## Prerequisites

1. **Rust & Cargo** - Must be installed and available in PATH
2. **CyberVault CLI** - Your Rust CLI project should be in the same directory as this web app
3. **IOTA Contracts** - Your smart contracts should be deployed and CLI configured

## Directory Structure

```
your-project/
├── cybervault-cli/          # Your Rust CLI project
│   ├── src/
│   ├── Cargo.toml
│   └── target/
├── client/                  # Web frontend
├── server/                  # Node.js backend
└── IOTA_SETUP.md           # This file
```

## CLI Commands Expected

The web interface will execute these commands from the project root:

```bash
# Register a new DID
cargo run --bin cybervault-cli -- register "did:cyber:example123"

# Bind DID to wallet address  
cargo run --bin cybervault-cli -- bind "did:cyber:example123" "0x742d35Cc6634C0532925a3b8D2EB24E0F"

# Notarize a document hash
cargo run --bin cybervault-cli -- notarize "sha256hashhere" "2024-01-01T10:00:00Z"
```

## Configuration

### Backend Configuration (server/iota-sdk.ts)

The `CyberVaultSDK` class handles CLI integration:

- **Base Path**: Configurable project root path (default: current directory)
- **Command Execution**: Uses Node.js `child_process.exec()` 
- **Error Handling**: Parses CLI output for errors vs compilation messages
- **Transaction Parsing**: Extracts transaction hashes from output

### Frontend Integration

The web interface provides:

- **Real-time Status**: CLI availability checking via `/api/iota/status`
- **Transaction Feedback**: Shows IOTA transaction hashes in notifications
- **Blockchain Verification**: Verifies documents against both local storage and blockchain
- **Visual Indicators**: Color-coded status for CLI connectivity

## Testing the Integration

1. **Check CLI Status**: Visit the dashboard - the blockchain status indicator shows CLI availability

2. **Register a DID**: 
   - Connect wallet (simulated)
   - Enter a DID like `did:cyber:test123`
   - Submit - should execute CLI command and show transaction hash

3. **Notarize Document**:
   - Upload any file or enter hash manually  
   - Select category
   - Submit - should execute CLI notarization command

4. **Verify Document**:
   - Enter a previously notarized hash
   - Should verify against both local storage and blockchain

## Troubleshooting

### CLI Not Available
- **Status**: Shows "CLI Unavailable" 
- **Fix**: Ensure Rust/Cargo installed and CLI project exists

### Command Execution Fails
- **Check**: CLI commands work manually from terminal
- **Verify**: Contract deployment and CLI configuration
- **Review**: Server logs for detailed error messages

### Transaction Hash Not Showing
- **Update**: CLI output parsing in `extractTransactionHash()` method
- **Customize**: Adjust regex pattern to match your CLI output format

## Customization

### Modify CLI Commands
Edit `server/iota-sdk.ts` methods:
- `registerDID()` - Customize DID registration command
- `bindDIDToWallet()` - Modify wallet binding command  
- `notarizeDocument()` - Adjust document notarization command

### Update Transaction Parsing
Modify `extractTransactionHash()` to match your CLI's output format:

```typescript
private extractTransactionHash(output: string): string {
  // Customize this regex to match your CLI output
  const hashMatch = output.match(/transaction[:\s]*([a-fA-F0-9]+)/i);
  return hashMatch ? hashMatch[1] : `tx_${Date.now()}`;
}
```

### Configure CLI Path
```typescript
const cyberVaultSDK = new CyberVaultSDK('/path/to/your/cli/project');
```

## API Endpoints

- `GET /api/iota/status` - Check CLI availability
- `POST /api/dids` - Register DID via CLI + local storage
- `POST /api/documents` - Notarize via CLI + local storage  
- `GET /api/documents/verify/:hash` - Verify via CLI + local lookup

## Security Notes

- CLI commands are executed server-side only
- Transaction hashes are logged and displayed for verification
- Local storage acts as cache/backup for blockchain data
- All operations maintain backward compatibility if CLI unavailable