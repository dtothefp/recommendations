import React, { useContext } from 'react';
import { RecommendationsContext } from './Recommendations.jsx';
import SingleRecommendation from './RecommendationsSingle.jsx';

export default () => {
  const {
    newRecommendationText,
    recommendations,
    handleTextAreaChanged,
    handleAddRecommendation,
  } = useContext(RecommendationsContext);

  return (
    <>
      <div>
        {recommendations.map(r => (
          <SingleRecommendation
            key={r.id}
            recommendationText={r.suggestion}
            mysteryProp={r.username}
          />
        ))}
      </div>
      <div>
        <div>
          <textarea value={newRecommendationText} onChange={handleTextAreaChanged}/>
        </div>
        <div>
          <button onClick={handleAddRecommendation}>Add</button>
        </div>
      </div>
    </>
  )
}
