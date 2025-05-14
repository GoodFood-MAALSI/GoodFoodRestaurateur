import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Consumer, Kafka, Producer } from 'kafkajs';

@Injectable()
export class OrderKafkaService implements OnModuleInit, OnModuleDestroy {
  private consumer: Consumer;
  private kafka: Kafka; // Ajout de l'instance Kafka pour la réutiliser

  constructor() {
    this.kafka = new Kafka({ // Initialiser l'instance Kafka ici
      clientId: 'restaurateur-order-service', // ID client adapté pour le restaurateur
      brokers: ['my-kafka-cluster-kafka-brokers.kafka.svc:9092'], // Conserver votre broker
    });
    this.consumer = this.kafka.consumer({ groupId: 'order-consumer-group' });
  }

  async onModuleInit() {
    console.log(
      'OrderKafkaService: Initializing Kafka consumer and producer...',
    );

    await this.consumer.connect();
    console.log('OrderKafkaService: Connected to Kafka');

    // S'abonner au topic "orders-infos" (nom de topic du restaurateur)
    await this.consumer.subscribe({
      topics: ['orders-infos'], // Utiliser le topic "orders-infos"
      fromBeginning: true,
    });
    console.log('OrderKafkaService: Subscribed to topic orders-infos');

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log(
          `OrderKafkaService: Received message from Kafka: Topic=${topic}, Partition=${partition}, Offset=${message.offset}`,
        );

        if (!message.value) {
          console.error(
            'OrderKafkaService: Message value is null, skipping message',
          );
          return;
        }

        try {
          // Traiter les messages du topic "orders-infos"
          if (topic === 'orders-infos') {
            // Adapter la logique de traitement du message à votre besoin.
            // Exemple : si les messages contiennent des informations de commande,
            // vous pouvez les traiter ici.  Assurez-vous de connaître la structure
            // des messages publiés sur "orders-infos".
            const orderData = JSON.parse(message.value.toString());
            console.log('OrderKafkaService: Parsed order data:', orderData);
            //  const newOrder = await this.orderService.create(orderData); // Supposons que orderService.create existe
            //  console.log(`OrderKafkaService: Order created successfully via Kafka: ${newOrder.id}`);
          }
        } catch (error) {
          console.error(
            'OrderKafkaService: Error processing Kafka message:',
            error,
          );
        }
      },
    });
  }

  async onModuleDestroy() {
    await this.consumer.disconnect();
  }
}
