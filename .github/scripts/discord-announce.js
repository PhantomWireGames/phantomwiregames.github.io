const fs = require('fs');
const https = require('https');

// Read news.json
const data = JSON.parse(fs.readFileSync('news.json', 'utf8'));
const posts = data.posts;

// Find the newest post that has a URL (i.e. is published)
const published = posts
  .filter(p => p.url && p.date)
  .sort((a, b) => new Date(b.date) - new Date(a.date));

if (published.length === 0) {
  console.log('No published posts found.');
  process.exit(0);
}

const post = published[0];
const baseUrl = 'https://phantomwiregames.github.io';
const postUrl = baseUrl + post.url;
const imageUrl = post.image ? baseUrl + post.image : null;

// Tag colour mapping
const tagColours = {
  announcement: 0xe11678,  // pink
  devlog:       0x9b59b6,  // purple
  update:       0x3498db,  // blue
};
const colour = tagColours[post.tag] || 0xe11678;

// Build Discord embed payload
const payload = {
  username: 'PhantomWire',
  avatar_url: 'https://phantomwiregames.github.io/assets/images/PFP.png',
  embeds: [
    {
      title: post.title,
      url: postUrl,
      description: post.excerpt,
      color: colour,
      fields: [
        {
          name: 'Type',
          value: post.tagDisplay || post.tag,
          inline: true,
        },
        {
          name: 'Date',
          value: post.dateDisplay,
          inline: true,
        },
        post.readTime ? {
          name: 'Read Time',
          value: post.readTime,
          inline: true,
        } : null,
      ].filter(Boolean),
      image: imageUrl ? { url: imageUrl } : undefined,
      footer: {
        text: 'phantomwiregames.com',
        icon_url: 'https://phantomwiregames.github.io/assets/images/PFP.png',
      },
      timestamp: post.date ? new Date(post.date).toISOString() : undefined,
    },
  ],
  content: '## 📰 New post from PhantomWire',
};

// Send to Discord
const body = JSON.stringify(payload);
const webhookUrl = new URL(process.env.DISCORD_WEBHOOK + '?wait=true');

const options = {
  hostname: webhookUrl.hostname,
  path: webhookUrl.pathname + webhookUrl.search,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
  },
};

function publishMessage(channelId, messageId) {
  if (!process.env.DISCORD_BOT_TOKEN) {
    console.log('No bot token set — skipping auto-publish.');
    return;
  }
  const pubOptions = {
    hostname: 'discord.com',
    path: `/api/v10/channels/${channelId}/messages/${messageId}/crosspost`,
    method: 'POST',
    headers: {
      'Authorization': `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      'Content-Length': 0,
    },
  };

  const pubReq = https.request(pubOptions, pubRes => {
    console.log(`Publish response: ${pubRes.statusCode}`);
    if (pubRes.statusCode === 200) {
      console.log('Message published successfully.');
    } else {
      console.error('Failed to publish message:', pubRes.statusCode);
      process.exit(1);
    }
  });

  pubReq.on('error', err => {
    console.error('Publish request error:', err);
    process.exit(1);
  });

  pubReq.end();
}

const req = https.request(options, res => {
  console.log(`Discord response: ${res.statusCode}`);
  if (res.statusCode === 204) {
    console.log('Announcement sent successfully.');
  } else if (res.statusCode === 200) {
    // Read body to get message ID for publishing
    let body = '';
    res.on('data', chunk => { body += chunk; });
    res.on('end', () => {
      try {
        const msg = JSON.parse(body);
        if (msg.id && msg.channel_id) {
          publishMessage(msg.channel_id, msg.id);
        }
      } catch (e) {
        console.error('Could not parse response:', e);
      }
    });
  } else {
    console.error('Unexpected status code:', res.statusCode);
    process.exit(1);
  }
});

req.on('error', err => {
  console.error('Request error:', err);
  process.exit(1);
});

req.write(body);
req.end();
