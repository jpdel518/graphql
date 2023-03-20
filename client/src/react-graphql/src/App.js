import logo from './logo.svg';
import './App.css';
import { Link } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { NavLink, Box } from "@mantine/core";
import { IconActivity, IconChevronRight } from "@tabler/icons-react";

const GET_HELLO = gql`
  query Hello($name: String!){
    hello(name: $name)
  }
`;

function App() {
  const { data, loading, error } = useQuery(GET_HELLO, {variables: {
    "name": "aaaaaa"
  }});

  if (loading) return <p>ローディング中です</p>
  if (error) {
    console.log(error);
    return <p>エラーが発生しています</p>
  }

  return (
      <div className="App">
        <header className="App-header">
          <h1>GraphQL</h1>
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>

          <p>
            {data.hello}
          </p>

          <Box>
            <Link to="/signup">
              <NavLink
                label="sign up"
                icon={<IconActivity size="1rem" stroke={1.5} />}
                rightSection={<IconChevronRight size="0.8rem" stroke={1.5} />}
                active
              />
            </Link>
            <Link to="/signin">
              <NavLink
                label="sign in"
                icon={<IconActivity size="1rem" stroke={1.5} />}
                rightSection={<IconChevronRight size="0.8rem" stroke={1.5} />}
                active
              />
            </Link>
          </Box>
        </header>
      </div>
  );
}

export default App;
