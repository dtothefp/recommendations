import React, { useContext } from 'react';
import { RecommendationsContext } from './Recommendations.jsx';
import SingleRecommendation from './RecommendationsSingle.jsx';

export default () => {
  const {recommendations} = useContext(RecommendationsContext);

  return (
    <>
      <div>
        {recommendations.map(r => (
          <SingleRecommendation
            key={r.auto_optimizer_id}
            recommendationText={r.auto_optimizer_explanation}
            mysteryProp="auto_optimizer"
          />
        ))}
      </div>
    </>
  )
}
