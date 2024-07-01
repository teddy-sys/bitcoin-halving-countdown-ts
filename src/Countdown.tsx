import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { getBlockCount } from './bitcoinService';
import { getLastHalvingBlock, calculateNextHalvingDate } from './halvingCounter';

interface TimeLeft {
  years: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const Countdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    years: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [currentBlock, setCurrentBlock] = useState<number>(0);

  useEffect(() => {
    const fetchBlockData = async () => {
      try {
        const blockCount = await getBlockCount();
        setCurrentBlock(blockCount);
      } catch (error) {
        console.error('Error fetching block data:', error);
      }
    };

    fetchBlockData();

    const intervalId = setInterval(fetchBlockData, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const lastHalvingBlock = getLastHalvingBlock(currentBlock);

    const fetchBlockTime = async () => {
      try {
        const halvingDate = calculateNextHalvingDate(currentBlock, lastHalvingBlock);

        const targetDate = moment(halvingDate.toDateString());

        const updateCountdown = () => {
          const now = moment();
          const duration = moment.duration(targetDate.diff(now));

          setTimeLeft({
            years: duration.years(),
            days: duration.days(),
            hours: duration.hours(),
            minutes: duration.minutes(),
            seconds: duration.seconds(),
          });
        };

        updateCountdown();

        const countdownIntervalId = setInterval(updateCountdown, 1000);

        return () => clearInterval(countdownIntervalId);
      } catch (error) {
        console.error('Error fetching block time:', error);
      }
    };

    fetchBlockTime();
  }, [currentBlock]);

  return (
    <div className="countdown">
      <h1>Bitcoin Halving Countdown</h1>
      <h2>Estimate Time</h2>
      <div className="time">
        <span>{timeLeft.years} Years</span>
        <span>{timeLeft.days} Days</span>
        <span>{timeLeft.hours} Hours</span>
        <span>{timeLeft.minutes} Minutes</span>
        <span>{timeLeft.seconds} Seconds</span>
      </div>
    </div>
  );
};

export default Countdown;

