import { getAuthSession } from '@/app/actions/auth';
import db from '@/lib/db';
import { creationSchema } from '@/schemas/financialRecord';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export const PATCH = async (req: Request, { params }: { params: { id: string } }) => {
	try {
		const body = await req.json();
		const session = await getAuthSession();

		if (!session) {
			return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
		}

		const data = creationSchema.parse(body);

		const financialRecord = await db.financialRecord.update({
			where: { id: params.id },
			data,
		});

		return NextResponse.json({ data: financialRecord });
	} catch (error) {
		if (error instanceof ZodError) {
			return NextResponse.json({ error: error.issues }, { status: 400 });
		}

		NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
	}
};

export const DELETE = async (req: Request, { params }: { params: { id: string } }) => {
	try {
		const session = await getAuthSession();

		if (!session) {
			return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
		}

		const financialRecord = await db.financialRecord.delete({
			where: { id: params.id },
		});

		return NextResponse.json({ data: financialRecord });
	} catch (error) {
		NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
	}
};
