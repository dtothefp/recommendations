import React, { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import CancelOnUnmount from '../../services/CancelOnUnmount.js'
import CampaignCoreSettingsRecommendationService from '../../services/CampaignCoreSettingsRecommendationService';
import CampaignGeoRecommendationService from '../../services/CampaignGeoRecommendationService';
import CampaignAdFormatRecommendationService from '../../services/CampaignAdFormatRecommendationService';
import './Recommendations.scss'

export const RecommendationsContext = createContext();

let componentTrackId = {id: 1};

const Recommendations = ({
  children,
  recommendationType,
  campaignId,
}) => {
  const ServicesDict = {
    'CAMPAIGN_CORE_SETTINGS_RECOMMENDATIONS': CampaignCoreSettingsRecommendationService,
    'CAMPAIGN_GEO_RECOMMENDATIONS': CampaignGeoRecommendationService,
    'CAMPAIGN_ADFORMAT_RECOMMENDATIONS': CampaignAdFormatRecommendationService,
  };
  const Service = ServicesDict[recommendationType];

  const [state, setState] = useState({
    newRecommendationText: '',
    recommendations: []
  });

  // this is firing on every navigation higher up the component tree
  // maybe has to because navigation may be mounting and unmounting the component
  useEffect(() => {
    if (Service && typeof Service.getAllRecommendations === 'function') {
      const servicePromise = Service.getAllRecommendations(campaignId).then(recommendations => {

        setState(prevState => ({
          ...prevState,
          recommendations,
        }));
      });

      CancelOnUnmount.track(componentTrackId, servicePromise);
    }

    return () => {
      CancelOnUnmount.handleUnmount(componentTrackId);

      componentTrackId = {id: componentTrackId.id += 1};
    };
  }, []);

  // event.target.value is throwing an error as undefined
  const handleTextAreaChanged = (e) => {
    const { value: newRecommendationText } = e.target;

    setState(prevState => ({
      ...prevState,
      newRecommendationText,
    }));
  }

  const handleAddRecommendation = () => {
    const recommendationText = state.newRecommendationText;

    setState(prevState => ({
      ...prevState,
      newRecommendationText: '',
    }));

    if (recommendationType === 'CAMPAIGN_CORE_SETTINGS_RECOMMENDATIONS' || recommendationType === 'CAMPAIGN_ADFORMAT_RECOMMENDATIONS') {
      const servicePromise = Service.addRecommendation(campaignId, recommendationText)
        .then(recommendation => {
          setState(prevState => ({
            ...prevState,
            recommendations: [ recommendation, ...prevState.recommendations ],
          }));
        })
        .catch(() => {
          alert('Couldn\'t add recommendation, please try again.');
        });

      CancelOnUnmount.track(componentTrackId, servicePromise);
    }
  }

  return (
    <RecommendationsContext.Provider value={{...state, handleAddRecommendation, handleTextAreaChanged}}>
      <div className="recommendations">
        {children}
      </div>
    </RecommendationsContext.Provider>
  );
}

Recommendations.propTypes = {
  recommendationType: PropTypes.oneOf([
    'CAMPAIGN_CORE_SETTINGS_RECOMMENDATIONS',
    'CAMPAIGN_GEO_RECOMMENDATIONS',
    'CAMPAIGN_ADFORMAT_RECOMMENDATIONS'
  ]).isRequired,
  campaignId: PropTypes.string.isRequired
}

export default Recommendations;
