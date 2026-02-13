import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const API_URL = 'https://www.fabiooliveira.cloud/api_aula/filmes/';
const AUTH_TOKEN = 'a8ea3f9c1e47b2d89f0d41b7f3c2d0c6';

function formatRevenue(value) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return 'R$ 0';
  }

  return `R$ ${amount.toLocaleString('pt-BR')}`;
}

function MovieCard({ movie }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: movie.linkPoster }} style={styles.cardImage} />
      <Text style={styles.cardTitle}>{movie.titulo}</Text>
      <Text style={styles.cardSubtitle}>Franquia: {movie.franquia || 'N/A'}</Text>
      <Text style={styles.cardSubtitle}>Ano: {movie.anoLancamento || 'N/A'}</Text>
      <Text style={styles.cardRevenue}>{formatRevenue(movie.valorArrecadacao)}</Text>
    </View>
  );
}

export default function SplashScreen() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchMovies = useCallback(async () => {
    try {
      setError('');

      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          Authorization: AUTH_TOKEN,
        },
      });

      if (!response.ok) {
        throw new Error(`Falha ao carregar filmes (${response.status}).`);
      }

      const payload = await response.json();
      setMovies(Array.isArray(payload) ? payload : []);
    } catch (fetchError) {
      setError('Não foi possível carregar os filmes. Tente novamente.');
      console.error(fetchError);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchMovies();
  }, [fetchMovies]);

  const emptyText = useMemo(() => {
    if (isLoading) {
      return 'Carregando filmes...';
    }

    if (error) {
      return error;
    }

    return 'Nenhum filme encontrado.';
  }, [error, isLoading]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filmes da Marvel</Text>

      {isLoading ? (
        <View style={styles.feedbackContainer}>
          <ActivityIndicator color="#fff" size="large" />
          <Text style={styles.feedbackText}>Buscando dados da API...</Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.listContent}
          data={movies}
          keyExtractor={(item) => String(item.codFilme)}
          numColumns={2}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor="#fff" />
          }
          renderItem={({ item }) => <MovieCard movie={item} />}
          ListEmptyComponent={<Text style={styles.feedbackText}>{emptyText}</Text>}
          columnWrapperStyle={styles.columnWrapper}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#a11e1e',
    alignItems: 'center',
    paddingTop: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#fff',
  },
  listContent: {
    paddingBottom: 40,
    width: '100%',
    paddingHorizontal: 8,
    gap: 12,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    gap: 12,
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 180,
    resizeMode: 'contain',
    borderRadius: 8,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'left',
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 13,
    textAlign: 'left',
    color: '#6b6b6b',
  },
  cardRevenue: {
    marginTop: 8,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#b31919',
  },
  feedbackContainer: {
    marginTop: 32,
    alignItems: 'center',
    gap: 8,
  },
  feedbackText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
