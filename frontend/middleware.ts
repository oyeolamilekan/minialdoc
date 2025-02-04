import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const url = req.nextUrl;
    const pathname = url.pathname;
    const hostname = req.headers.get("host") || "";

    console.log("Request URL:", req.url);
    console.log("Pathname:", pathname);
    console.log("Hostname:", hostname);

    const baseDomain = process.env.BASE_DOMAIN || "appstate.co";
    
    // Handle static files and API routes first
    if (pathname.match(/^\/(_next|api|static)/)) {
        console.log("Static or API route detected, passing through");
        return NextResponse.next();
    }

    // Parse hostname to handle different scenarios
    const { subdomain, isBaseDomain } = parseHostname(hostname, baseDomain);
    console.log("Parsed subdomain:", subdomain);
    console.log("Is base domain:", isBaseDomain);

    // If it's the base domain or no subdomain, handle directly
    if (isBaseDomain || !subdomain) {
        console.log("Base domain or no subdomain detected, handling auth and dashboard");
        return handleAuthAndDashboard(req);
    }

    // If the pathname already starts with the subdomain, don't rewrite
    if (pathname.startsWith(`/${subdomain}`)) {
        console.log("Path already contains subdomain, handling auth and dashboard");
        return handleAuthAndDashboard(req);
    }

    // Rewrite the URL to include the subdomain in the path
    const newUrl = new URL(`/${subdomain}${pathname}`, req.url);
    console.log("Rewriting to:", newUrl.toString());

    const rewrite = NextResponse.rewrite(newUrl);
    return handleAuthAndDashboard(req, rewrite);
}

function parseHostname(hostname: string, baseDomain: string): { subdomain: string | null; isBaseDomain: boolean } {
    // Handle localhost cases
    if (hostname.includes('localhost')) {
        const parts = hostname.split(':');
        const host = parts[0];
        
        // Handle plain localhost
        if (host === 'localhost') {
            return { subdomain: null, isBaseDomain: true };
        }
        
        // Handle subdomain.localhost
        const subdomain = host.replace('.localhost', '');
        return { subdomain, isBaseDomain: false };
    }

    // Handle production domain cases
    if (hostname === baseDomain) {
        return { subdomain: null, isBaseDomain: true };
    }

    if (hostname.endsWith(`.${baseDomain}`)) {
        const subdomain = hostname.replace(`.${baseDomain}`, '');
        return { subdomain, isBaseDomain: false };
    }

    return { subdomain: null, isBaseDomain: true };
}

function handleAuthAndDashboard(req: NextRequest, response?: NextResponse) {
    const token = req.cookies.get("token")?.value;
    const pathname = req.nextUrl.pathname;

    if (!token && pathname.includes("/dashboard")) {
        return NextResponse.redirect(new URL("/auth/sign-in", req.url));
    }

    if (token && pathname.includes("/auth")) {
        return NextResponse.redirect(new URL("/dashboard/projects", req.url));
    }

    return response || NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * 1. Matches files with extensions (e.g., .css, .js, .svg)
         * 2. _next/static (static files)
         * 3. _next/image (image optimization files)
         * 4. favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'
    ]
};