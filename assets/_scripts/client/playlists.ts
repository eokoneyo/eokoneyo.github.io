import { Component } from 'gia';
import { setAttributes, addClass } from './utils';
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
  // eslint-disable-next-line camelcase
  external_urls: Record<'spotify', string>;
  public: boolean;
  description: string;
  owner: {
    id: string;
  };
};

type SpotifyPlaylistsResponse = {
  href: string;
  items: SpotifyPlaylist[];
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

type PlaylistsState = {
  error: string;
  fetching: boolean;
  playlists: Array<SpotifyPlaylist>;
};

type PlaylistsRef = {
  playlistLoader: HTMLElement[];
  playlistContainer: HTMLElement[];
};

class Playlists extends Component<PlaylistsRef, PlaylistsState> {
  private readonly userId: string;

  constructor(element: HTMLElement) {
    super(element);

    this.userId = process.env.SPOTIFY_USERNAME!;

    this.ref = {};
  }

  async handlePlaylistFetch(): Promise<void> {
    try {
      this.setState({
        fetching: true,
      });

      const { access_token: token } = await getAuthorizationToken(
        process.env.SPOTIFY_CLIENT_ID!,
        process.env.SPOTIFY_CLIENT_SECRET!
      );

      const { items: playlists } = await fetchSpotifyUserPlaylists(
        this.userId,
        token
      );

      this.setState({
        playlists: playlists.filter(
          (item) => item.public && item.owner.id === this.userId
        ),
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

  static renderErrorFetchingPlaylists = (): HTMLElement => {
    const error = document.createElement('div');

    error.innerHTML = `Error fetching playlist data...`;

    return error;
  };

  renderPlaylists = (): HTMLElement => {
    const { playlists } = this.state;

    const playlistsItemsWrapper = document.createElement('ul');

    addClass(playlistsItemsWrapper, 'no-style-list playlist-wrapper row');

    playlists?.reduce((wrapper, playlist) => {
      const li = document.createElement('li');
      addClass(li, 'playlist-item column-12 column-md-4');
      li.innerHTML = `
        <figure>
          <a href="${playlist.external_urls.spotify}" target="_blank">
              <picture>
                ${playlist.images
                  .reduce((result, image) => {
                    if (image.width) {
                      result.push(
                        `<source srcset="${image.url} ${image.width}w">`
                      );
                    }
                    return result;
                  }, [] as string[])
                  .concat(
                    `<img src="${playlist.images[0].url}" alt="cover art for ${playlist.name}"/>`
                  )
                  .join('')}
              </picture>
              <figcaption>${playlist.name}</figcaption>
          </a>
        </figure>
      `;
      wrapper.append(li);
      return wrapper;
    }, playlistsItemsWrapper);

    return playlistsItemsWrapper;
  };

  renderFetchOutcome(): void {
    const [loader] = this.ref.playlistLoader ?? [];
    const [playlistContainer] = this.ref.playlistContainer ?? [];
    const fragment = document.createDocumentFragment();

    const { error } = this.state;

    const fetchOutcome = error
      ? Playlists.renderErrorFetchingPlaylists()
      : this.renderPlaylists();

    setAttributes(loader, { hidden: '' });

    fragment.appendChild(fetchOutcome);
    playlistContainer.appendChild(fragment);
  }

  stateChange(
    stateChanges: Partial<{
      error: string;
      fetching: boolean;
      playlists: Array<SpotifyPlaylist>;
    }>
  ): void {
    if ('playlists' in stateChanges || 'error' in stateChanges) {
      setAttributes(this.element, { 'data-loaded': 'true' });
    }
  }

  mount(): void {
    const [loader] = this.ref.playlistLoader ?? [];

    loader.addEventListener('animationend', this.renderFetchOutcome.bind(this));

    this.handlePlaylistFetch().finally(() =>
      logger.debug('playlist fetch done')
    );
  }
}

export default Playlists;
