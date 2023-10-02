import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export { default } from 'next-auth/middleware';

export async function middleware(request: NextRequest) {
	const sensitiveRoutes = ['/dashboard', '/money'];
	const publicRoutes = ['/'];
	const pathname = request.nextUrl.pathname;

	const token = await getToken({ req: request });
	const isAuth = !!token;

	if (isAuth && publicRoutes.some((route) => route === pathname)) {
		return NextResponse.redirect(new URL('/money', request.url));
	}

	if (!isAuth && sensitiveRoutes.some((route) => pathname.startsWith(route))) {
		return NextResponse.redirect(new URL('/', request.url));
	}
}

export const config = {
	matcher: ['/dashboard', '/money', '/'],
};
