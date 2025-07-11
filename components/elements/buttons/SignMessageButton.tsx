
import { usePrivy } from '@privy-io/react-auth';
import { useSignMessage } from '@privy-io/react-auth/solana';

// const { signMessage } = useSignMessage();

export const SignMessageButton = () => {
    const { authenticated, ready } = usePrivy();
    // const { createWallet, wallets } = useSolanaWallets();
    const { signMessage } = useSignMessage();
    // const { signMessage } = useSignMessage({
    //     onSuccess: ({ signature }) => {
    //         console.log(`success ${signature}`);
    //         // Any logic you'd like to execute after a user successfully signs a message
    //     },
    //     onError: (error) => {
    //         console.log(`error ${error}`);
    //         // console.log(error);
    //         // Any logic you'd like to execute after a user exits the message signing flow or there is an error
    //     },
    // });

    const message = new TextEncoder().encode('Hello world');
    // const message = 'Hello world';
    const uiOptions = {
        title: 'Sign Message',
        description: 'Sample description text',
        buttonText: 'Sign',
    };

    // const walletToDelegate = wallets.find((wallet) => wallet.walletClientType === 'privy');

    const handleSignMessage = async () => {
        // const a = await wallets[0].signMessage(message);
        // console.log(wallets[0].address);

        await signMessage({ message, options: { uiOptions } });
        // if (ready && authenticated) {
        //     await signMessage('111', {}, wallets[0].address);
        // }

        //     if (walletToDelegate) {
        //         // const { signature } =
        //         await walletToDelegate.signMessage(message);
        //     }

        //     // await walletToDelegate?.signMessage(message);
        //     // const signature = await signMessage(message, uiOptions, wallets[0].address);
        //     // console.log(signature);
    };

    // console.log({ ready, authenticated });

    return (
        <button
            onClick={handleSignMessage}
            type="button"
            className="h-button h-button-border h-[38px] min-h-[38px] py-3 px-3 bg-slate-400/10 gap-1.5 inline-flex disabled:opacity-50 disabled:pointer-events-none rounded-[100px] justify-center items-center 
        text-center text-white text-sm font-semibold font-figtree"
        >
            Sign
        </button>
    );
};
