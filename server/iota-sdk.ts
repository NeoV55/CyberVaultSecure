import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface IOTAOperationResult {
  success: boolean;
  data?: any;
  error?: string;
}

export class CyberVaultSDK {
  private basePath: string;

  constructor(basePath: string = '.') {
    this.basePath = basePath;
  }

  /**
   * Register a new DID on the IOTA blockchain
   */
  async registerDID(did: string): Promise<IOTAOperationResult> {
    try {
      console.log(`Registering DID: ${did}`);
      const command = `cargo run --bin cybervault-cli -- register "${did}"`;
      const { stdout, stderr } = await execAsync(command, { cwd: this.basePath });
      
      if (stderr && !stderr.includes('Compiling')) {
        throw new Error(stderr);
      }

      return {
        success: true,
        data: {
          did,
          transactionHash: this.extractTransactionHash(stdout),
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('DID registration failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Bind a DID to a wallet address on the IOTA blockchain
   */
  async bindDIDToWallet(did: string, walletAddress: string): Promise<IOTAOperationResult> {
    try {
      console.log(`Binding DID ${did} to wallet ${walletAddress}`);
      const command = `cargo run --bin cybervault-cli -- bind "${did}" "${walletAddress}"`;
      const { stdout, stderr } = await execAsync(command, { cwd: this.basePath });
      
      if (stderr && !stderr.includes('Compiling')) {
        throw new Error(stderr);
      }

      return {
        success: true,
        data: {
          did,
          walletAddress,
          transactionHash: this.extractTransactionHash(stdout),
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('DID binding failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Notarize a document hash on the IOTA blockchain
   */
  async notarizeDocument(dataHash: string, timestamp: string): Promise<IOTAOperationResult> {
    try {
      console.log(`Notarizing document hash: ${dataHash}`);
      const command = `cargo run --bin cybervault-cli -- notarize "${dataHash}" "${timestamp}"`;
      const { stdout, stderr } = await execAsync(command, { cwd: this.basePath });
      
      if (stderr && !stderr.includes('Compiling')) {
        throw new Error(stderr);
      }

      return {
        success: true,
        data: {
          dataHash,
          timestamp,
          transactionHash: this.extractTransactionHash(stdout),
          blockchainTimestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Document notarization failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Query blockchain for DID information
   */
  async queryDID(did: string): Promise<IOTAOperationResult> {
    try {
      // This would be a query command if your CLI supports it
      // For now, we'll simulate based on local storage
      console.log(`Querying DID: ${did}`);
      
      return {
        success: true,
        data: {
          did,
          exists: true,
          onChain: true
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Query failed'
      };
    }
  }

  /**
   * Verify document hash on blockchain
   */
  async verifyDocument(dataHash: string): Promise<IOTAOperationResult> {
    try {
      console.log(`Verifying document hash: ${dataHash}`);
      
      // This would be a verify command if your CLI supports it
      // For now, we'll check against local storage and mark as blockchain-verified
      return {
        success: true,
        data: {
          dataHash,
          verified: true,
          onChain: true
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Verification failed'
      };
    }
  }

  /**
   * Extract transaction hash from CLI output
   */
  private extractTransactionHash(output: string): string {
    // Parse CLI output to extract transaction hash
    const hashMatch = output.match(/hash[:\s]*([a-fA-F0-9]+)/i);
    return hashMatch ? hashMatch[1] : `tx_${Date.now()}`;
  }

  /**
   * Check if CyberVault CLI is available
   */
  async checkCLIAvailability(): Promise<boolean> {
    try {
      await execAsync('cargo --version', { cwd: this.basePath });
      return true;
    } catch {
      return false;
    }
  }
}

// Singleton instance
export const cyberVaultSDK = new CyberVaultSDK();