import { Component } from 'gia';
import logger from './utils/logger';
import requestClient from './utils/requestClient';

type SpotifyPlaylist = {
  id: string;
  name: string;
  href: string;
  images: Array<{
    url: string;
    width: string | null;
    height: string | null;
  }>;
  tracks: {
    total: number;
    href: string;
  };
  public: boolean;
  description: string;
};

type SpotifyPlaylistsResponse = {
  href: string;
  items: Array<SpotifyPlaylist>;
};

const getAuthorizationToken = (clientId: string, clientSecret: string) =>
  // eslint-disable-next-line camelcase
  requestClient<{ access_token: string }>({
    url: 'https://accounts.spotify.com/api/token',
    method: 'POST',
    body: {
      grant_type: 'client_credentials',
    },
    headers: {
      Authorization: ['Basic', window.btoa(`${clientId}:${clientSecret}`)].join(
        ' '
      ),
    },
  });

const fetchSpotifyUserPlaylists = (userId: string, requestToken: string) =>
  requestClient<SpotifyPlaylistsResponse>({
    url: `https://api.spotify.com/v1/users/${userId}/playlists`,
    headers: {
      Authorization: ['Bearer', requestToken].join(' '),
    },
  });

class Playlists extends Component<{
  error: string;
  fetching: boolean;
  playlists: Array<SpotifyPlaylist>;
}> {
  async handlePlaylistFetch(): Promise<void> {
    try {
      this.setState({
        fetching: true,
      });

      // eslint-disable-next-line camelcase
      const { access_token: token } = await getAuthorizationToken(
        ':troll:',
        ':troll:'
      );

      const { items: playlists } = await fetchSpotifyUserPlaylists('maziey93', token);

      this.setState({
        playlists: playlists.filter((item) => item.public),
      });
    } catch (e) {
      logger.error(e);
      this.setState({
        error: e.message,
      });
    } finally {
      this.setState({
        fetching: false,
      });
    }
  }

  mount(): void {
    this.handlePlaylistFetch();
  }
}

export default Playlists;
