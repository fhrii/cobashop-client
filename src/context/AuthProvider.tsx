import { ApolloQueryResult, useQuery } from '@apollo/client';
import { createContext, FC, useContext, useMemo } from 'react';
import MeQuery from '../graphql/query/MeQuery';
import { Me, Me_me } from '../graphql/query/__generated__/Me';

interface IAuthContext {
  isAuth: boolean;
  isAuthLoading: boolean;
  user?: Me_me;
  refetchAuth: (
    variables?: Partial<Record<string, any>> | undefined
  ) => Promise<ApolloQueryResult<Me>>;
}

const AuthContext = createContext({} as IAuthContext);

export function useAuth() {
  return useContext(AuthContext);
}

const AuthProvider: FC = ({ children }) => {
  const { data, loading: isAuthLoading, refetch: refetchAuth } = useQuery<Me>(
    MeQuery,
    {
      errorPolicy: 'ignore',
    }
  );

  const isAuth = useMemo(() => !!data, [data]);

  return (
    <AuthContext.Provider
      value={{ isAuth, isAuthLoading, user: data?.me, refetchAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
