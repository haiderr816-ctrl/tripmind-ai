import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: '#1a1a2e',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              background: '#7C3AED',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                color: 'white',
                fontSize: '48px',
                fontWeight: 'bold',
              }}
            >
              ✈
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                color: '#7C3AED',
                fontSize: '64px',
                fontWeight: '800',
                letterSpacing: '-2px',
              }}
            >
              TripMind
            </div>
            <div
              style={{
                color: 'white',
                fontSize: '48px',
                fontWeight: '600',
                letterSpacing: '-1px',
              }}
            >
              AI
            </div>
          </div>
        </div>
        <div
          style={{
            color: '#a0a0b0',
            fontSize: '32px',
            marginTop: '40px',
            fontWeight: '500',
          }}
        >
          Plan Your Perfect Trip with AI
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
