import React from 'react';
import Wrapper from './Wrapper';

function Footer() {
  return (
    <Wrapper>
      <section>
        <div style={{ fontSize: '10px', textAlign: "center" }}>
          Champions Charts isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends.
          League of Legends and Riot Games are trademarks or registered trademarks of Riot Games, Inc. League of Legends © Riot Games, Inc.
        </div>
      </section>
    </Wrapper>
  );
}

export default Footer;
