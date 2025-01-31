import { ReactNode } from "react";
import { Loader2 } from "lucide-react";

type SuspencePropType = {
    children: ReactNode,
    fallBackEmpty?: ReactNode,
    isLoading: boolean,
    isEmpty?: boolean | null,
    isError: boolean,
}

export const CustomSupense = ({
    children,
    fallBackEmpty,
    isLoading,
    isEmpty,
    isError
}: SuspencePropType) => {
    if (isError)
        return <div className="text-center p-5">Something bad happended, kindly reach out to support.</div>
    else if (isLoading)
        return <div className="flex items-center justify-center w-full h-full min-h-[200px]">
            <Loader2 className="w-12 h-12 dark:text-white animate-spin" strokeWidth={1} />
        </div>
    else if (isEmpty)
        return <>{fallBackEmpty}</>
    else
        return <>{children}</>
}