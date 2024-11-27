import { Server as NetServer } from 'http';
import { NextApiRequest } from 'next';
import { NextApiResponse } from 'next';
import { Server as ServerIO } from 'socket.io';
import { NextResponse } from 'next/server';

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponse) => {
  if (!res.socket.server.io) {
    const path = '/api/socket/io';
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: path,
      addTrailingSlash: false,
    });
    res.socket.server.io = io;
  }

  res.end();
}

export async function GET(req: Request) {
  try {
    // @ts-ignore
    await ioHandler(req, { socket: { server: req.socket?.server } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Socket initialization error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize socket' },
      { status: 500 }
    );
  }
}
