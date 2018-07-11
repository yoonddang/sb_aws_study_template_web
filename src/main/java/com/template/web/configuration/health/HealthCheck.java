package com.template.web.configuration.health;

import com.template.common.configuration.properties.ProjectData;
import com.template.common.configuration.properties.Servers;
import com.template.common.restfull.annotation.RestServer;
import org.apache.http.conn.ConnectTimeoutException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

import java.net.ConnectException;
import java.net.SocketTimeoutException;

@Component
public class HealthCheck implements HealthIndicator {
    private Logger logger = LoggerFactory.getLogger(HealthCheck.class);
    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private ProjectData projectData;

    @Override
    public Health health() {
        Servers se = projectData.getServers();
        String url = se.getUrl(RestServer.PROCESS_SERVER.getKey()) + "/health";

        try {
            ResponseEntity<String> healthResponse = restTemplate.getForEntity(url, String.class);
            if (healthResponse.getStatusCode().equals(HttpStatus.OK)) {

                return Health.up().build();

            } else {
                int errorCode = 503;
                return Health.down()
                        .withDetail("game", errorCode)
                        .build();
            }
        } catch (ResourceAccessException e) {
            logger.error("Some other exception", e);
            if (e.getRootCause() instanceof SocketTimeoutException || e.getRootCause() instanceof ConnectTimeoutException  || e.getRootCause() instanceof ConnectException) {

                return Health.down()
                        .withDetail("server", url)
                        .build();
            } else {
                return Health.down()
                        .build();
            }
        }
    }

}
